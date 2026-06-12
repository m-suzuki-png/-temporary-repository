export const runtime = "nodejs";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { summarizePdf } from "../../../library/open_ai/summarizePdf";
// import {test} from "../../../library/test_open_ai/test";
import { createClient } from "@supabase/supabase-js";
import { upload_supabase } from "../../../library/upload_supabase/upload_supabase";
import {logger} from "../../../library/logger/logger"

//supabaseにpdfを保存させる　原本をそのままで

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

//supabaseにpdfを保存させる　原本をそのままで
async function upload(pdfPath : string){

  const fileBuffer = fs.readFileSync(pdfPath);

  const fileName = path.basename(pdfPath);

  const { data, error } = await supabase.storage
    .from("origin_pdf_save")
    .upload(`CustomerA${fileName}`, fileBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) {
    logger.error(error)
     }

  return data;

};
//supabaseにpdfを保存させる　原本をそのままで


//open aiにpdfファイルを読み込ませる
export async function GET() {
  try {

      const pdfPath = path.join(
      process.cwd(),
      "sample",
      "cp.pdf"
    );

    if(!fs.existsSync(pdfPath)){
      throw new Error('該当PDFが存在しません: ${pdfPath}')
    }

     const summary = await summarizePdf(pdfPath);

    if(summary.error){
       return NextResponse.json(
      {
        error: String(summary.error),
      },
       );
    }

     await upload(pdfPath);
     await upload_supabase(summary);

    return NextResponse.json(
      {
        success: true, //これは現時点で使っていない
        summary: summary.ai_summary,
      });


  } catch (error) {
    logger.error(error)

    return NextResponse.json(
      {
        error: String(error),
      },
      { status: 500 }
    );
  }
}
//open aiにpdfファイルを読み込ませる







// //open aiの代わりに挙動を見るためのプログラム
// export async function GET(){
//   try{

//       const pdfPath = path.join(
//       process.cwd(),
//       "sample",
//       "cp.pdf"
//     );
//     const summary=await test(); 
//     await upload(pdfPath);
//     await upload_supabase(summary);

//     return NextResponse.json(
//       {
//       summary: summary.ai_summary
//     });

//   }catch (error) {
//     return NextResponse.json(
//       {
//         error: String(error),
//       },
//       { status: 500 }
//     );
//   }
// }
//open aiの代わりに挙動を見るためのプログラム