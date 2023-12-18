# SaasHQ

SaasHQ is a CRM build on top of the Next.JS 13.4 using TypeScript, great UI library shadcn, Prisma and Postgresql as a database. Upload things as a S3 blob for document storage.

## Online Demo

You can try it here [demo.saashq.org](https://demo.saashq.org), login via Google account or create new user and password.

## What we used to build it

[Next.js](https://nextjs.org/) - React framework </br> [shadcn](https://ui.shadcn.com/) - UI </br> [Prisma](https://prisma.io/) ORM - together with [Postgresql](https://www.postgresql.org/) </br> [useSWR](https://swr.vercel.app/) - for client side data fetching </br> [NextAUTH](https://next-auth.js.org/) - for user authentication </br> [Rossum](https://rossum.ai/) - for invoice data parsing with AI </br> [OpenAI API](https://openai.com/blog/openai-api) - for automated email notifications </br> [Tremor](https://www.tremor.so/) - for creating charts </br> [resend.com](https://resend.com) - together with [react.email](https://react.email) </br>

![hero](/public/og.png)

## What we plan to build next

1. More AI powered - daily summary of tasks and project (OpenAI integration) - in test
2. Email campaigns management - integration with MailChimp and Listmonk - in planning
3. ~~Docker version - in planning (There will be complete bundle to run SaasHQ on-premise)~~
4. Testing - Jest + Cypress (if anyone want to help I will be very happy) - in planning
5. Fix all Types issue (no more "any") - in progress
6. i18n - localization - in planning (if anyone want to help I will be very happy)

## Emails

We use [resend.com](https://resend.com) + [react.email](https://react.email) as primary email sender and email templates.

## Reports

We use Tremor charts as a tool for creating charts in SaasHQ

![hero](/public/reports.png)

## Documentation

Available soon at: http://docs.saashq.org

## Installation

<details><summary><b>Show instructions</b></summary>

1. Clone the repository:

   ```sh
   git clone https://github.com/saashqdev/saashq.git
   cd saashq
   ```

1. Install the preset:

   ```sh
   npm install
   ```

1. Copy the environment variables to .env

   ```sh
   cp .env.example .env
   ```
   ```sh
   cp .env.local.example .env.local
   ```

   **.env**

   > > - You will need Postgres URI string for Prisma ORM

   **.env.local**

   > > - NextAUTH - for auth
   > > - uploadthing - for storing files
   > > - rossum - for invoice data exporting
   > > - openAI - for automatic Project management assistant
   > > - SMPT and IMAP for emails

1. Init Prisma

   ```sh
    npx prisma generate
    npx prisma db push
    npx prisma seed
   ```

1. Run app on local

   ```sh
   npm run dev
   ```

1. Import initial data from initial-data folder

   ```sh
   npx prisma db seed
   ```
   
1. http://localhost:3000

</details>

## Docker installation

[Link to Docker HUB](https://hub.docker.com/repository/docker/saashqdev/saashq/general)

<details><summary><b>Show instructions</b></summary>

1. Postgres URI string for Prisma ORM:

2. Install the preset:

   ```create
   .env (for Prisma URI string) and .env.local (all others ENVs) file inside docker folder
   ```

3. run docker-compose

   ```sh
   docker-compose up -d
   ```

4. Init Prisma

   ```sh
    docker-compose exec saashq npx prisma generate
    docker-compose exec saashq npx prisma db push
   ```

5. Import initial data from initial-data folder

   ```sh
   npx prisma db seed
   ```

6. http://localhost:3000
</details>

## Contact

[SaasHQ](https://saashqdev@gmail.com)

## License

Licensed under the [MIT license](https://github.com/saashqdev/saashq/blob/main/LICENSE.md).
