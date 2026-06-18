"use client";

import { sentReportMail } from "../../library/sent_gmail/sent_gmail";

export default function MailItem({ item }: { item: any }) {
  const handleSend = async () => {
    await sentReportMail(item.id);
    alert("送信しました");
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginTop: 16 }}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{item.mailaddress}</pre>
      <pre style={{ whiteSpace: "pre-wrap" }}>{item.ai_summary}</pre>
      <button onClick={handleSend}>メール送信</button>
    </div>
  );
}