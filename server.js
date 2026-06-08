require('dotenv').config();

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3001;
const buildDirectory = path.join(__dirname, 'build');
const publicDirectory = path.join(__dirname, 'public');
const staticDirectory = fs.existsSync(buildDirectory) ? buildDirectory : publicDirectory;

app.use(cors());
app.use(express.json({ limit: '50kb' }));
app.use(express.static(staticDirectory));

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true',
    auth: { user, pass },
  });
}

app.post('/api/contact', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim();
    const subject = String(req.body.subject || '').trim();
    const message = String(req.body.message || '').trim();

    if (!email || !subject || !message) {
      return res.status(400).json({ error: 'Email, subject, and message are required.' });
    }

    const transporter = createTransporter();

    if (!transporter) {
      return res.status(500).json({
        error: 'Mail configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in the environment.',
      });
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: process.env.MAIL_TO || 'youthengineersinitiative@gmail.com',
      replyTo: email,
      subject,
      text: `From: ${email}\n\n${message}`,
    });

    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to send email right now.' });
  }
});

app.use((req, res) => {
  res.sendFile(path.join(staticDirectory, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});