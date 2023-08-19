/*
This API endpoint is used to add a new task to a section.
*/
import sendEmail from "@/lib/sendmail";
import { prismadb } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const today = dayjs().startOf("day");
    const nextWeek = dayjs().add(7, "day").startOf("day");
    let prompt = "";

    const users = await prismadb.users.findMany({
      where: {
        userStatus: "ACTIVE",
      },
    });

    if (!users) {
      return res.status(201).json("No users found");
    }

    for (const user of users) {
      const getTaskPastDue = await prismadb.tasks.findMany({
        where: {
          AND: [
            {
              user: user.id,
            },
            {
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
              user: user.id,
            },
            {
              dueDateAt: {
                //lte: dayjs().add(7, "day").toDate(),
                gt: today.toDate(), // Due date is greater than or equal to today
                lt: nextWeek.toDate(), // Due date is less than next week (not including today)
              },
            },
          ],
        },
      });

      //console.log(user.userLanguage, "users.userLanguage");
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
          }  to remind them of their tasks. And also dont forget to send them a some positive vibes.
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
          } als Link zum Aufgabendetail. Am Ende der Zusammenfassung hinzufügen. 1 Management-Skill-Tipp im Bereich Projektmanagement und Zeitmanagement, 2-3 Sätze mit positiver Einstellung und Unterstützung, abschließend einen schönen Arbeitstag wünschen und mitteilen, dass diese Nachricht mit der künstlichen Intelligenz von OpenAi generiert wurde.
          \n\n
          `;
          break;
      }

      const getAiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/openai/createChatCompletion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
        }
      ).then((res) => res.json());

      if (!user.email) {
        return res.status(201).json("No user email found");
      }

      await sendEmail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: `${process.env.NEXT_PUBLIC_APP_NAME} OpenAI Project manager assistant`,
        text: getAiResponse.response,
      });
    }

    return res.status(201).json("Success");
    //TODO: Fix this
  } catch (error: any) {
    //console.log(error);
    return res.status(500).json({ error: error.message });
  }
}
