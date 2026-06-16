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

app.post("/contact", (req, res) => {
  console.log("TEST ROUTE HIT");
  return res.json({ ok: true });
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