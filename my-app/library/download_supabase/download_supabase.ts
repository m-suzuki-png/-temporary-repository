import { createClient } from "@supabase/supabase-js";
import {logger} from "../logger/logger"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function download_supabase(i : number) {

 const { data: files, error: listError } = await supabase.storage
  .from("origin_pdf_save")
  .list("2026_6");

if (listError) throw listError;

const pdfFiles = (files ?? []).filter((file: any) =>
  file.name.toLowerCase().endsWith(".pdf")
);
console.log(i);

const pdfFile = pdfFiles[i];

if (!pdfFile) {
  throw new Error("PDFファイルがありません");
}

const { data: pdfData, error: downloadError } = await supabase.storage
  .from("origin_pdf_save")
  .download(`2026_6/${pdfFile.name}`);

if (downloadError) throw downloadError;

return new Response(pdfData, {
  headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${pdfFile.name}"`,
  },
});
}