import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ error: "Use POST" });
  }

  try {
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
    } = req.body || {};

    if (!email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const isPartnerForm = organization || role || interest;

    let mailSubject = "";
    let mailBody = "";

    if (isPartnerForm) {
      mailSubject = `🤝 Partnership Request - ${organization || "Unknown Org"}`;
      mailBody = `
NAME: ${name || "N/A"}
EMAIL: ${email}

ORG: ${organization || "N/A"}
ROLE: ${role || "N/A"}
INTEREST: ${interest || "N/A"}

STUDENTS: ${students || "N/A"}
TIMEFRAME: ${timeframe || "N/A"}

MESSAGE:
${message}
      `;
    } else {
      mailSubject = `Contact Form - ${subject || "No Subject"}`;
      mailBody = `
EMAIL: ${email}
SUBJECT: ${subject}

MESSAGE:
${message}
      `;
    }

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
    console.error("EMAIL ERROR:", err);

    return res.status(500).json({
      error: "Email failed",
      detail: err.message,
    });
  }
}