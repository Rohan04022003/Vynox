import nodemailer from "nodemailer";
import { SUPPORT_MAIL } from "../constants.js";
import * as templates from "../utils/MailTemplates.js";
import { NO_REPLY_MAIL } from "../constants.js";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendMail = async (type, to, data) => {
  try {
    let subject;
    let html;
    let from = `"Vynox no-reply" <${NO_REPLY_MAIL}>`;

    switch (type) {
      case "register":
        subject = "Welcome to Vynox!";
        html = templates.registerTemplate(data);

        break;
      case "login":
        subject = "Login Alert - Vynox";
        html = templates.loginAlertTemplate(data)
        break;
      case "profileUpdate":
        subject = "Profile Updated Successfully - Vynox";
        html = templates.profileUpdateTemplate(data);
        break;
      case "passwordReset":
        subject = "Reset Your Vynox Password";
        html = templates.passwordResetTemplate(data);
        from = `"Vynox Support" <${SUPPORT_MAIL}>`;
        break;
      case "videoUpload":
        subject = "Your Video is Live on Vynox!";
        html = templates.videoUploadTemplate(data);
        break;
      case "tweetUpload":
        subject = "Your Tweet is Published on Vynox!";
        html = templates.tweetUploadTemplate(data);
        break;
      default:
        throw new Error("Invalid email type");
    }

    const mailOptions = {
      from,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`${type} mail sent to ${to}`);
  } catch (error) {
    console.error("Error sending mail:", error.message);
  }
};
