import OpenAI from "openai";
import {logger} from "../../library/logger/logger"
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizePdf(origin: Blob) {
  const file = await client.files.create({
    file: origin,
    purpose: "user_data",
  });


  if(!file.id){
    throw new Error("アップロード失敗")
  }
  else{
    logger.info("アップロード成功")
  }

  const response = await client.responses.create({
    model: "gpt-5-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_file",
            file_id: file.id,
          },
          {
            type: "input_text",
            text: `

このPDFを解析して、以下のJSONのみを出力してください。
数値項目はPDFから読み取ってください。(0の部分を)
説明文やコードブロックは不要です。

{
  "ai_summary": "",
  "customer_id": 11,
  "report_month": "",
  "pdf_path": "任意の文字列",
  "av_count": 0 ,
  "ips_count": 0,
  "bot_count": 0,
  "infected_Hosts": 0,
  "trafficGb_gb" : 0 
}

顧客にgmailを書きます。以下のことを端的にまとめたメール文章を書いてください
ai_summaryにそのメール文章をそのまま挿入してください

顧客向け月次セキュリティレポートを作成してください。
専門用語を減らし、非エンジニアにも分かる文章にしてください。
この機器が防いだ脅威と、防げなかった場合に想定されるリスクを説明してください。
一枚のPDFサイズにしたいのと、見た瞬間にわかるようにカラーの図を入れてください

            `,
          },
        ],
      },
    ],
  });

  if(!response){
    throw new Error("Open AI にアップロードができませんでした")
  }
  else{
    logger.info("アップロードに成功しました")
  }

  const report=JSON.parse(response.output_text);

  return report;
}

