import { createClient } from "@supabase/supabase-js";
import {logger} from "../logger/logger"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function upload_supabase(fileName:string,summary:any){

  // filenameをもとに戻す
  const encoded = fileName.replace(/\.pdf$/i, "");

  const base64 = encoded
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  // filenameをもとに戻す
   
  // macアドレス抽出
  const remac=base64.slice(0,12)
  // メールアドレス抽出
 
  const recompanyname= base64.match(
  /_asdfgh(.*?)lkjhg_/
)?.[1];

  const reemail=base64.match(
    /lkjhg_(.*?)\.pdf/
  )


 const { data, error } = await supabase
    .from("reports")
    .insert({
      customer_id: summary.customer_id,
      report_month: summary.report_month,
      pdf_path: summary.pdf_path,
      av_count: summary.av_count,
      ips_count: summary.ips_count,
      bot_count: summary.bot_count,
      infected_hosts: summary.infected_Hosts,
      traffic_gb: summary.trafficGb_gb,
      ai_summary: summary.ai_summary,
      MacAddress: remac,
      MailAddress:reemail,
      companyName:recompanyname
    })
    .select();

  if (error) {
    logger.error(error,"supabaseに適切に保存されていません")
    throw error
  }
  

  return data;

}



