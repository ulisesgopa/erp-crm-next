import dayjs from "dayjs";
import axios from "axios";

import sendEmail from "@/lib/sendmail";
import { prismadb } from "@/lib/prisma";

export async function getUserAiTasks(userId: string) {
  const today = dayjs().startOf("day");
  const nextWeek = dayjs().add(7, "day").startOf("day");

  let prompt = "";

  const user = await prismadb.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) return { message: "No user found" };

  const getTaskPastDue = await prismadb.tasks.findMany({
    where: {
      AND: [
        {
          user: userId,
          taskStatus: "ACTIVE",
          dueDateAt: {
            lte: new Date(),
          },
        },
      ],
    },
  });

  const getTaskPastDueInSevenDays = await prismadb.tasks.findMany({
    where: {
      AND: [
        {
          user: userId,
          taskStatus: "ACTIVE",
          dueDateAt: {
            //lte: dayjs().add(7, "day").toDate(),
            gt: today.toDate(), // Due date is greater than or equal to today
            lt: nextWeek.toDate(), // Due date is less than next week (not including today)
          },
        },
      ],
    },
  });

  if (!getTaskPastDue || !getTaskPastDueInSevenDays) {
    return { message: "No tasks found" };
  }

  switch (user.userLanguage) {
    case "en":
      prompt = `Hi, Iam ${process.env.NEXT_PUBLIC_APP_URL} API Bot.
      \n\n
      There are ${getTaskPastDue.length} tasks past due and ${
        getTaskPastDueInSevenDays.length
      } tasks due in the next 7 days.
      \n\n
      Details today tasks: ${JSON.stringify(getTaskPastDue, null, 2)}
      \n\n
      Details next 7 days tasks: ${JSON.stringify(
        getTaskPastDueInSevenDays,
        null,
        2
      )}
      \n\n
      As a personal assistant, write a message to ${
        user.name
      }  to remind them of their tasks. And also do not forget to send them a some positive vibes.
      \n\n
      `;
      break;
    case "de":
      prompt = `Als professionelle Assistentin ist Emma mit perfekten Kenntnissen im Projektmanagement für die Projekte vor Ort verantwortlich${
        process.env.NEXT_PUBLIC_APP_URL
      }, Erstellen Sie eine Managementzusammenfassung der Aufgaben, einschließlich ihrer Details und Fristen. Alles muss perfekt tschechisch und prägnant sein.
      \n\n
      Hier finden Sie Informationen zu den Aufgaben:
      \n\n
      Projektinformationen: Anzahl der heute zu lösenden Aufgaben: ${
        getTaskPastDue.length
      }, Die Anzahl der Aufgaben, die innerhalb von spätestens sieben Tagen gelöst werden müssen: ${
        getTaskPastDueInSevenDays.length
      }.
      \n\n
      Detaillierte Informationen im JSON-Format für Aufgaben, die heute erledigt werden müssen: ${JSON.stringify(
        getTaskPastDue,
        null,
        2
      )}
      \n\n
      Detaillierte Informationen zu Aufgaben, die innerhalb der nächsten sieben Tage erledigt werden müssen: ${JSON.stringify(
        getTaskPastDueInSevenDays,
        null,
        2
      )}
    
      \n\n
      Schreiben Sie am Ende eine Managementzusammenfassung, einschließlich einer netten Begrüßung, schreiben Sie für den Benutzer: ${
        user.name
      } und einen Link hinzufügen ${
        process.env.NEXT_PUBLIC_APP_URL + "/projects/dashboard"
      } als Link zum Aufgabendetail. Am Ende der Zusammenfassung hinzufügen. 1 Management-Skill-Tipp im Bereich Projektmanagement und Zeitmanagement, 2-3 Sätze mit positiver Einstellung und Unterstützung, abschließend einen schönen Arbeitstag wünschen und mitteilen, dass diese Nachricht durch die künstliche Intelligenz von OpenAi generiert wurde.
      \n\n
      `;
      break;
  }

  if (!prompt) return { message: "No prompt found" };

  const getAiResponse = await axios
    .post(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/openai/create-chat-completion`,
      {
        prompt: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => res.data);

  //console.log(getAiResponse, "getAiResponse");

  //skip if api response is error
  if (getAiResponse.error) {
    console.log("Error from OpenAI API");
  } else {
    await sendEmail({
      from: process.env.EMAIL_FROM,
      to: user.email!,
      subject: `${process.env.NEXT_PUBLIC_APP_NAME} OpenAI Project manager assistant`,
      text: getAiResponse.response.message.content,
    });
  }

  return { user: user.email };
}