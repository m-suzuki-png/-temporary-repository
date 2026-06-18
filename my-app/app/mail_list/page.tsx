"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function MailListPage() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("mailaddress, companyname, id, ai_summary, report_month");
      if (error) {
        setError(error.message);
      } else {
        setData(data ?? []);
      }
    };
    fetch();
  }, []);

  const handleSend = async (id: number) => {
    const res = await fetch("/api/send-mail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      alert("送信しました");
    } else {
      alert("送信失敗");
    }
  };

  if (error) return <div>取得失敗: {error}</div>;

  return (
    <main style={{ padding: 24 }}>
      <h1>メール確認画面</h1>

      {data?.map((item) => (
        <div
          key={item.id}
          style={{ border: "1px solid #ddd", padding: 16, marginTop: 16 }}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>{item.mailaddress}</pre>
          <pre style={{ whiteSpace: "pre-wrap" }}>{item.ai_summary}</pre>

          <button onClick={() => handleSend(item.id)}>
            メール送信
          </button>
        </div>
      ))}
    </main>
  );
}