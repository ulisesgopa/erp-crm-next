# SaasHQ

SaasHQ is a CRM build on top of the Next.JS 13.4 using TypeScript, great UI library shadcn, Prisma and Postgresql as a database. Uploadthings as a S3 blob for document storage.

Based off the awesome NextCRM only using Postgresql as the backend and added German translation.

## What we use to build it

Next.js - React framework</br>
shadcn - UI</br>
Prisma ORM - together with Postgresql</br>
useSWR - for client side data fetching</br>
NextAUTH - for user authentication</br>
Rossum - for invoice data parsing with AI</br>
OpenAI API - for automated email notifications</br>
Tremor - for creating charts</br>
Resend.com - together with react.email </br>

![hero](/public/og.png)

## What we plan to build next

1. More AI powered - daily summary of tasks and project (OpenAI integration ) - in test
2. Email campaigns management - integration to MailChimp and Listmonk - in planning
3. Docker version - in planning (There will be complete bundle to run NextCRM on-premise)

## Emails

We use Resend.com + React.email as primary email sender and email templates

[resend.com](https://resend.com) + [react.email](https://react.email)

## Reports

We use Tremor charts as a tool for creating charts in SaasHQ

![hero](/public/reports.png)

## Documentation

Will be soon at domain: http://docs.saashq.org

## Installation

<details><summary><b>Show instructions</b></summary>

1. Install the preset:

   ```sh
   npm install
   ```

2. .env + .env.local - Change .env.example to .env and .env.local.example to .env.local

**.env**

> > - You will need mongodb URI string for Prisma ORM

**.env.local**

> > - NextAUTH - for auth
> > - uploadthings - for storing files
> > - rossum - for invoice data exporting
> > - openAI - for automatic Project management assistant
> > - SMPT and IMAP for emails

3. Init Prisma

   ```sh
    npx prisma generate
    npx prisma db push
   ```

4. Run app on local

   ```sh
   npm run dev
   ```

5. Import initial data from initial-data folder

</details>

## Contact Us

[SaasHQ](mailto:saashqdev@gmail.com)

## License

Licensed under the [MIT license](https://github.com/saashqdev/saashq/blob/main/LICENSE.md).
