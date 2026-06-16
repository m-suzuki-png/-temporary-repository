"use client";

import { useState } from "react";
import { logger } from "../library/logger/logger";

export default function Home() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const url="/api/read-drive-pdf"
  const pdf_number=100;

  async function run() {
   try{
    setLoading(true);
    setSummary("");
   
    for(let i=0 ; i< pdf_number; i++){

    const res = await fetch(
    `${url}?pdf_number=${i}`
     );

    if(!res.ok){
      throw new Error(`Https error:${res.status}`);
    }
    
    const data = await res.json();

    if(data.summary){
      setSummary(`${data.summary}`)
    }
    else if(data.error){
      setSummary(`${data.error}`)
    }
    else{
      setSummary("結果がありません")
    } 
    
  }

  }catch(error){
   logger.error(error,"ユーザー取得処理失敗");
   setSummary("PDFの読み込みに失敗しました");
}  
   finally{
   setLoading(false);
}
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>PDF要約アプリ</h1>

      <button onClick={run} disabled={loading}>
        {loading ? "実行中..." : "PDF要約を実行"}
      </button>

      <pre style={{ whiteSpace: "pre-wrap", marginTop: 24 }}>
        {summary}
      </pre>
    </main>
  );
}