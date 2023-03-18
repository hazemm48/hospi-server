import nodemailer from "nodemailer";
import { resetHtml } from "./forgetPass.template.js";
import { emailHtml } from "./email.template.js";
import jwt from "jsonwebtoken";

const sendMAil = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hospi.sim@gmail.com",
      pass: "tumbkzoanloetonc",
    },
  });

  let emailToken = jwt.sign(
    { email: options.email },
    process.env.TOKEN_KEY_VERIFY
  );

  if (options.operation == "reset") {
    let info = await transporter.sendMail({
      from: '"HOSPI" <hospi.sim@gmail.com>',
      to: options.email,
      subject: "Reset Password",
      html: resetHtml(options.code),
    });
  } else if (options.operation == "verify") {
    let info = await transporter.sendMail({
      from: '"HOSPI" <hospi.sim@gmail.com>',
      to: options.email,
      subject: "Verify Your Email",
      html: emailHtml(emailToken),
    });
  }
};

export { sendMAil };
