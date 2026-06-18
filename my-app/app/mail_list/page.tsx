import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function MailListPage() {
  const { data, error } = await supabase
    .from("reports")
    .select("id, ai_summary");

  if (error) {
    return <div>取得失敗: {error.message}</div>;
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>メール確認画面</h1>

      {data?.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: 16,
            marginTop: 16,
          }}
        >
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {item.ai_summary}
          </pre>

          <button>
            メール送信
          </button>
        </div>
      ))}
    </main>
  );
}