// export const runtime = "nodejs";

// import OpenAI from "openai";
// import fs from "fs";
// import path from "path";
// import { NextResponse } from "next/server";

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function GET() {
//   try {
//     const pdfPath = path.join(process.cwd(), "sample", "cp.pdf");

//     const file = await client.files.create({
//       file: fs.createReadStream(pdfPath),
//       purpose: "user_data",
//     });

//     const response = await client.responses.create({
//       model: "gpt-5-mini",
//       input: [
//         {
//           role: "user",
//           content: [
//             {
//               type: "input_file",
//               file_id: file.id,
//             },
//             {
//               type: "input_text",
//               text: `
//                    このPDFの内容を以下の内容を踏まえて要約してください

//                    顧客向け月次セキュリティレポートを作成してください。
//                    専門用語を減らし、非エンジニアにも分かる文章にしてください。
//                    お客様にこの製品の良さを伝えたいので、この機械が防いだものによってどういった脅威から防げたかを
//                    伝える文章にしてほしい。またもし防げなかったらどうなっていたかを伝えてほしい。
//                    `                
//               },
//           ],
//         },
//       ],
//     });

//     console.log("=== Summary ===");
//     console.log(response.output_text);
//     console.log("===============");




//   return new Response(
//   `
//   <html>
//     <body style="font-family: sans-serif; padding: 24px;">
//       <h1>PDF要約結果</h1>
//       <pre style="white-space: pre-wrap; line-height: 1.6;">
//   ${response.output_text}
//       </pre>
//     </body>
//    </html>
//   `,
//    {
//     headers: {
//       "Content-Type": "text/html; charset=utf-8",
//     },
//    }
//                      );



//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         error: String(error),
//       },
//       { status: 500 }
//     );
//   }
// }




export const runtime = "nodejs";

import path from "path";
import { NextResponse } from "next/server";
// import { summarizePdf } from "@/app/library/open_ai/summarizePdf";
import {test} from "@/app/library/test_open_ai/test";

export async function GET(){
  try{
    const summary=await test();

    return NextResponse.json(
      {
      summary: summary
    });

  }catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}



// export async function GET() {
//   try {
//     const pdfPath = path.join(process.cwd(), "sample", "cp.pdf");

//     const summary = await summarizePdf(pdfPath);

//     return NextResponse.json(
//       {
//         success: true, //これは現時点で使っていない
//         summary: summary,
//       });


//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false, //これは現時点で使っていない
//         error: String(error),
//       },
//       { status: 500 }
//     );
//   }
// }

