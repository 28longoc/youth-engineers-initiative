import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    email,
    subject,
    message,
    name,
    organization,
    role,
    interest,
    students,
    timeframe,
  } = req.body;

  const isPartnerForm = organization || role || interest;

  let mailSubject = "";
  let mailBody = "";

  if (isPartnerForm) {
    mailSubject = `🤝 Partnership Request - ${organization || "Unknown Org"}`;

    mailBody = `
NEW PARTNERSHIP REQUEST

Name: ${name || "N/A"}
Email: ${email || "N/A"}
Organization: ${organization || "N/A"}
Role: ${role || "N/A"}
Interest: ${interest || "N/A"}

Expected Students: ${students || "N/A"}
Timeframe: ${timeframe || "N/A"}

Message:
${message || "N/A"}
    `;
  } else {
    mailSubject = `📩 Contact Form - ${subject || "No Subject"}`;

    mailBody = `
NEW CONTACT MESSAGE

Email: ${email || "N/A"}
Subject: ${subject || "N/A"}

Message:
${message || "N/A"}
    `;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: mailSubject,
      text: mailBody,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Email failed" });
  }
}