import nodemailer from "nodemailer";

export async function sentReportMail(summary: {
  ai_summary: string;
  report_month: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: `月次セキュリティレポート ${summary.report_month}`,
    text: summary.ai_summary,
  });
}