import axios from "axios";
import FormData from "form-data";
import { google, sheets_v4 } from "googleapis";

export async function uploadFileToImgBB(imageURL: string): Promise<string> {
  const form = new FormData();
  console.info(imageURL);
  form.append("key", process.env.IMGBB_TOKEN);
  form.append("image", imageURL);
  form.append("name", "");
  form.append("expiration", 15552000); // 6 months
  const res = await axios.request({
    method: "post",
    url: "https://api.imgbb.com/1/upload",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: form,
  });
  return res.data.data.url;
}

export async function createGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
  const jwtClient = new google.auth.JWT(
    process.env.SHEETS_CLIENT_NAME,
    "",
    (process.env.SHEETS_CLIENT_KEY || "").replace(/\\n/gm, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  await jwtClient.authorize();
  const sheets = google.sheets({ version: "v4", auth: jwtClient });

  return sheets;
}

export async function getTelegramFilePath(fileID: string): Promise<string> {
  const res = await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getFile?file_id=${fileID}`
  );
  if (typeof res === "object" && res != null) {
    return res.data.result.file_path;
  }
  throw new Error("JSON error");
}
