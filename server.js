require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// =========================
// EMAIL SETUP (GMAIL)
// =========================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional debug check (VERY useful)
transporter.verify((error) => {
  if (error) {
    console.log("❌ Email server not ready:", error);
  } else {
    console.log("✅ Email server ready");
  }
});

// =========================
// CONTACT + PARTNER ROUTE
// =========================

app.post("/contact", async (req, res) => {
  console.log("🔥 FORM HIT RECEIVED 🔥");
  console.log(req.body);

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

  // =========================
  // PARTNER FORM
  // =========================
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
  }

  // =========================
  // CONTACT FORM
  // =========================
  else {
    mailSubject = `📩 Contact Form - ${subject || "No Subject"}`;

    mailBody = `
NEW CONTACT MESSAGE

Email: ${email || "N/A"}
Subject: ${subject || "N/A"}

Message:
${message || "N/A"}
    `;
  }

  // =========================
  // SEND EMAIL
  // =========================
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: mailSubject,
      text: mailBody,
    });

    console.log("📨 Email sent successfully");

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Email failed to send",
    });
  }
});



// =========================
// FALLBACK ROUTE
// =========================
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});