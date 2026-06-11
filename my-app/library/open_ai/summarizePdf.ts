import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function summarizePdf(pdfPath: string) {
  const file = await client.files.create({
    file: fs.createReadStream(pdfPath),
    purpose: "user_data",
  });

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
  "pdf_path": "${pdfPath}",
  "av_count": 0 ,
  "ips_count": 0,
  "bot_count": 0,
  "infected_hosts": 0,
  "traffic_gb" 0: 
}

ai_summaryには、顧客向け月次セキュリティレポートを書いてください。下記を参考に記載してください

顧客向け月次セキュリティレポートを作成してください。
専門用語を減らし、非エンジニアにも分かる文章にしてください。
この機器が防いだ脅威と、防げなかった場合に想定されるリスクを説明してください。

            `,
          },
        ],
      },
    ],
  });

  const report=JSON.parse(response.output_text);

  return report;
}