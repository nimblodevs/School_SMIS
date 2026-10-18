import nodemailer from 'nodemailer';

function getEmailConfiguration() {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  return {
    host: process.env.GMAIL_HOST || process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: (process.env.GMAIL_SECURE ?? process.env.SMTP_SECURE) === 'true',
    user,
    password: process.env.GMAIL_PASSWORD || process.env.SMTP_PASSWORD,
    from: process.env.AUTH_EMAIL_FROM || user,
  };
}

export function assertAuthenticationEmailConfigured() {
  const { host, port, user, password, from } = getEmailConfiguration();
  if (!host || !port || !user || !password || !from) {
    const error = new Error('Configure GMAIL_HOST, SMTP_PORT, GMAIL_USER, and GMAIL_PASSWORD (or the equivalent SMTP_* variables) to send authentication email.');
    error.code = 'AUTH_EMAIL_NOT_CONFIGURED';
    throw error;
  }
}

function getMailer() {
  assertAuthenticationEmailConfigured();
  const { host, port, secure, user, password } = getEmailConfiguration();
  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure,
    auth: { user, pass: password },
  });
}

export async function sendAuthenticationCode({ email, fullName, code, purpose }) {
  const transporter = getMailer();
  const passwordReset = purpose === 'password_reset';
  const subject = passwordReset ? 'Reset your School SMIS password' : 'Verify your School SMIS email';
  const action = passwordReset ? 'reset your password' : 'verify your email address';
  const greeting = fullName.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);

  await transporter.sendMail({
    from: getEmailConfiguration().from,
    to: email,
    subject,
    text: `Hello ${fullName},\n\nUse this code to ${action}: ${code}\n\nThis code expires in 10 minutes. If you did not request this, you can ignore this message.`,
    html: `<p>Hello ${greeting},</p><p>Use this code to ${action}:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If you did not request this, you can ignore this message.</p>`,
  });
}
