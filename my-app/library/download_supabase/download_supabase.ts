import { createClient } from "@supabase/supabase-js";
import {logger} from "../logger/logger"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const filePath = "2026_6/monthly_report_xxx.pdf";

  const { data, error } = await supabase.storage
    .from("pdf")
    .download(filePath);

  if (error) {
    return new Response("PDF not found", { status: 404 });
  }

  return new Response(data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cp.pdf"',
    },
  });
}