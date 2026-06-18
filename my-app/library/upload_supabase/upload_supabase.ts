import { createClient } from "@supabase/supabase-js";
import {logger} from "../logger/logger"
import { Buffer } from "buffer";

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

    const decodedName = Buffer
    .from(base64, "base64")
    .toString("utf-8");
  // filenameをもとに戻す
   
  // macアドレス抽出
  const remac=decodedName.slice(0,12)
  // メールアドレス抽出
 
  const recompanyname=  decodedName.match(
  /_asdfgh(.*?)lkjhg_/
)?.[1];

  const reemail= decodedName.match(
    /lkjhg_(.*?)\.pdf/
  )?.[1];


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
      macaddress: remac,
      mailaddress:reemail,
      companyname:recompanyname
    })
    .select();

  if (error) {
    logger.error(error,"supabaseに適切に保存されていません")
    throw error
  }
  

  return data;

}



