import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass
  }
});

export async function sendVerifyEmail(to: string, verifyUrl: string) {
  const subject = 'Verify your email - Nuclian eSports';
  const text = `Verify your email by opening this link: ${verifyUrl}`;
  const html = `
    <p>Welcome to Nuclian eSports.</p>
    <p>Verify your email by clicking:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
  `;

  await transporter.sendMail({
    from: env.smtpUser,
    to,
    subject,
    text,
    html
  });
}
