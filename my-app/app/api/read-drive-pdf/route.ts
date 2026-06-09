export const runtime = "nodejs";

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("ここに来たら軌道はしている")

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), "sample", "cp.pdf");

    const file = await client.files.create({
      file: fs.createReadStream(pdfPath),
      purpose: "user_data",
    });

    const response = await client.responses.create({
      model: "gpt-5",
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
              text: "このPDFの内容を要約してください。重要ポイントも箇条書きで出してください。",
            },
          ],
        },
      ],
    });

    console.log("=== Summary ===");
    console.log(response.output_text);
    console.log("===============");


  return new Response(
  `
  <html>
    <body style="font-family: sans-serif; padding: 24px;">
      <h1>PDF要約結果</h1>
      <pre style="white-space: pre-wrap; line-height: 1.6;">
  ${response.output_text}
      </pre>
    </body>
   </html>
  `,
   {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
   }
                     );



  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}


