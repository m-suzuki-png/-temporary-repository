import { supabase } from "@/lib/supabase";

export async function upload_supabase(summary:any){
 console.log("関数に入った");
 console.log(`summaryの中に入っているか確認。${summary.traffic_gb}`);

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
    })
    .select();

  if (error) {
    throw error;
  }

  return data;

}