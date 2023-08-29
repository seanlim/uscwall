import axios from "axios";
import FormData from "form-data";
import { google, sheets_v4 } from "googleapis";
import { WORKSHEET_TEST } from "./constants";

export async function uploadFileToImgBB(imageURL: string): Promise<string> {
  const form = new FormData();
  console.info(imageURL);
  form.append("key", process.env.IMGBB_TOKEN);
  form.append("image", imageURL);
  form.append("name", "");
  if (process.env.NODE_ENV === "development") {
    form.append("expiration", 300); // 5 minutes
  }
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

export async function insertIntoSheet(range: string, values: any[][]) {
  const client = await createGoogleSheetsClient();
  await client.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: process.env.NODE_ENV === "development" ? WORKSHEET_TEST : range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values,
    },
  });
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
