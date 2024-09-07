import sgMail, { MailDataRequired } from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendMail = async (options: MailDataRequired) => {
  try {
    await sgMail.send(options);
    console.log("Message sent: %s");
  } catch (error) {
    console.log("Error sending mail: %s", error);
    throw new Error("Failed to send email");
  }
};
