import "dotenv/config";
import OpenAI from "openai";
import { google } from "googleapis";
import { Readable } from "node:stream";
import fs from "node:fs/promises";
import path from "node:path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

async function downloadPdfFromGoogleDrive(fileId: string): Promise<string> {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL!,
    key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.get(
    {
      fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    {
      responseType: "stream",
    }
  );

  const outputPath = path.resolve("./input.pdf");
  const chunks: Buffer[] = [];

  await new Promise<void>((resolve, reject) => {
    const stream = res.data as Readable;

    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("end", resolve);
    stream.on("error", reject);
  });

  await fs.writeFile(outputPath, Buffer.concat(chunks));

  return outputPath;
}

async function askOpenAIToReadPdf(pdfPath: string) {
  const file = await openai.files.create({
    file: await OpenAI.toFile(Buffer.from(await fs.readFile(pdfPath)), "input.pdf"),
    purpose: "user_data",
  });

  const response = await openai.responses.create({
    model: "gpt-5.1",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: "このPDFの内容を読み取り、要点を日本語で簡潔にまとめてください。",
          },
          {
            type: "input_file",
            file_id: file.id,
          },
        ],
      },
    ],
  });

  console.log(response.output_text);
}

async function main() {
  const fileId = process.env.GOOGLE_DRIVE_FILE_ID;
  if (!fileId) throw new Error("GOOGLE_DRIVE_FILE_ID is missing");

  const pdfPath = await downloadPdfFromGoogleDrive(fileId);
  await askOpenAIToReadPdf(pdfPath);
}

main().catch(console.error);