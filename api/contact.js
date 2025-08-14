import nodemailer from "nodemailer";

export default async (req, res) => {
  try {
    // 1. Parse JSON
    const data = await new Promise((resolve, reject) => {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new Error("Invalid JSON"));
        }
      });
      req.on("error", reject);
    });

    // 2. Validate
    if (!data.name || !data.email || !data.message) {
      return res.status(400).json({ error: "All fields required" });
    }

    // 3. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 5000,
    });

    await transporter.sendMail({
      from: `Contact Form <${process.env.SMTP_USER}>`,
      to: process.env.RECIPIENT_EMAIL,
      subject: "New Message",
      text: `Name: ${data["name"]}\nEmail: ${data.email}\nMessage: ${data.message}`,
    });

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Server error: ", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
};
