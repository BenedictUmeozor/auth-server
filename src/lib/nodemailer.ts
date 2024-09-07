import nodemailer from "nodemailer";
import { MailOptions } from "types/global";

const emailAdress = process.env.EMAIL_ADDRESS;
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: emailAdress,
    pass: emailPassword,
  },
});

export const sendMail = async (options: MailOptions) => {
  const info = await transporter.sendMail({ ...options });
  console.log("Message sent: %s", info.messageId);
};
