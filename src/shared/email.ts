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

    const result =
      await resend.emails.send({

        from:
          "TourGen <hello@tourgen.in>",

        to,

        subject,

        html,
      });

    console.log(
      "EMAIL SENT:",
      result
    );

  } catch (err) {

    console.error(
      "EMAIL ERROR:",
      err
    );

  }

};