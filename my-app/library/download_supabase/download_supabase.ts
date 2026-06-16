import { createClient } from "@supabase/supabase-js";
import {logger} from "../logger/logger"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function download_supabase() {

  const {data: files, error}=await supabase.storage
  .from("pdf")
  .list("2026_6");

  console.log(files);

  return

//   const target = files?.find((item : {name:string}) =>
//   /^monthly_report_.*\.pdf$/.test(item.name)
// );

const filePath = `2026_6/${target.name}`;

const { data, error } = await supabase.storage
  .from("pdf")
  .download(filePath);


  if (error) {
    return new Response("PDF not found", { status: 404 });
  }

  return new Response(data, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${target.name}"`,
    },
  });
}