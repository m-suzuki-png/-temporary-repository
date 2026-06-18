import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function sentReportMail(id: number) {
  const { data, error } = await supabase
    .from("reports")
    .select("ai_summary, report_month, mailaddress")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new Error("データ取得失敗: " + error?.message);
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: data.mailaddress,
    subject: `月次セキュリティレポート ${data.report_month}`,
    text: data.ai_summary,
  });
}