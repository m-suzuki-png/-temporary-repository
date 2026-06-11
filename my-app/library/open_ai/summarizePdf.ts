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
このPDFの内容を以下の内容を踏まえて要約してください。

顧客向け月次セキュリティレポートを作成してください。
専門用語を減らし、非エンジニアにも分かる文章にしてください。
この機器が防いだ脅威と、防げなかった場合に想定されるリスクを説明してください。

            `,
          },
        ],
      },
    ],
  });

  return response.output_text;
}