import { createClient } from "@supabase/supabase-js";
import {logger} from "../logger/logger"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function upload_supabase(fileName:string,summary:any){

  // filenameからmacaddressを抽出
 const remac=fileName
 .replace(/:/g,"")
 .replace(/\.pdf$/i,"");

//  下は、スプレッドシートに送る用
 const sent_mac=fileName
 .replace(/\.pdf$/i,"");
  // filenameからmacaddressを抽出

//  gasにつなぐ→macaddressから会社の名前と、メールアドレスを探す

console.log("vercel→gasをつなげる前")

const res = await fetch(
  `https://script.google.com/s/AKfycbzwObh5kfv7ZG172FoslMhUtZrwkieoCjJOfH3lz043SVP6B1efsC1bHtrjAtFiQLP-/exec?mac=${encodeURIComponent(sent_mac)}`
);

const result = await res.json();
console.log("vercel→gasをつなげ終わりました")

console.log(result.companyname);
console.log(result.email);

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
      MailAddress:result.email,
      companyName:result.companyname
    })
    .select();

  if (error) {
    logger.error(error,"supabaseに適切に保存されていません")
    throw error
  }
  

  return data;

}



