// TODO: npm install nodemailer
import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // 1. Transporter banayein (Use Mailtrap for dev, SendGrid/AWS SES for prod)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  // 2. Email options define karein
  const mailOptions = {
    from: '99acres Clone Support <support@99acresclone.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // 3. Email send karein
  await transporter.sendMail(mailOptions);
};