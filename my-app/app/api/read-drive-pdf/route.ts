export const runtime = "nodejs";

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), "sample", "cp.pdf");

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
                   このPDFの内容を要約してください。

                   今から考慮してほしいことを書きます。

                  1. これは顧客に渡すデータなので、難しく書かないでください。
                  2. 目的は、この機械をずっと使ってもらうことです。
                  3. そのために、インシデントを強調してください。
                  4. 「これだけ危険だったが、この機械を導入してこれだけ防げた」というアピールにしてください。
                  5. 図・カラー・見出しを使い、ITに詳しくない人にも分かるようにしてください。
` 
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


