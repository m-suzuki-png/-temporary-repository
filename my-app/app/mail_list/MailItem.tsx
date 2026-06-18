"use client";

export default function MailItem({ item }: { item: any }) {
  const handleSend = async () => {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id }),
    });

    if (res.ok) {
      alert("送信しました");
    } else {
      alert("送信失敗");
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginTop: 16 }}>
      <pre style={{ whiteSpace: "pre-wrap" }}>{item.mailaddress}</pre>
      <pre style={{ whiteSpace: "pre-wrap" }}>{item.ai_summary}</pre>
      <button onClick={handleSend}>メール送信</button>
    </div>
  );
}