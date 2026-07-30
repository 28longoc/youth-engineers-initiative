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
      formType,
      website,
    } = req.body || {};

    if (website) {
      return res.status(200).json({ success: true });
    }

    if (!email || !message || !name || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Please complete the required fields." });
    }

    const isPartnerForm = formType === "partner" || organization || role || interest;

    if (isPartnerForm && (!organization || !role || !interest)) {
      return res.status(400).json({ error: "Please complete the partnership details." });
    }

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
NAME: ${name || "N/A"}
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
      to: process.env.MAIL_TO || "youthengineersinitiative@gmail.com",
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
