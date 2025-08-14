import nodemailer from "nodemailer";

export default async (req, res) => {
  // Parse the JSON data
  const data = await new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(JSON.parse(body)));
  });

  const givenName = data.name;
  const givenEmail = data.email;
  const givenMessage = data.message;

  // Send the email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `Gathering & Sending Data <${process.env.SMTP_USER}>`,
    to: process.env.RECIPIENT_EMAIL,
    subject: `New message from ${givenName}`,
    text: `Name: ${name}\n Email: ${email}\n Message: ${message}`,
  });

  res.status(200).send("OK");
};
