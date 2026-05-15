import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {

  try {

    await resend.emails.send({
      from:
        "AI Travel Planner <onboarding@resend.dev>",

      to,

      subject,

      html,
    });

  } catch (err) {

    console.error(
      "EMAIL ERROR:",
      err
    );

  }

};