"use client";

import { useState } from "react";

export default function Home() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setSummary("");

    const res = await fetch("/api/read-drive-pdf");
    const data = await res.json();

    setSummary(data.summary || data.error || "結果がありません");
    setLoading(false);
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>PDF要約アプリ</h1>

      <button onClick={run} disabled={loading}>
        {loading ? "実行中..." : "PDF要約を実行"}
      </button>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 24 }}>
        {summary}
      </pre>
    </main>
  );
}