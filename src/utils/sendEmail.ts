import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME } from "../config";
import nodemailer from "nodemailer";

interface ISendEmailParams {
  mailTo: string;
  subject: string;
  html: string;
}

type TSendEmail = (
  params: ISendEmailParams
) => Promise<{ success: boolean; message: string }>;

export const sendEMail: TSendEmail = async ({ mailTo, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: {
        name: "Razer bot",
        address: SMTP_USERNAME!,
      },
      to: mailTo,
      subject,
      html,
    });

    const testMessageUrl = nodemailer.getTestMessageUrl(info) || "";
    return { success: true, message: testMessageUrl };
  } catch (error) {
    console.log("❌ Email sending error : ", error);
    return { success: false, message: "" };
  }
};
