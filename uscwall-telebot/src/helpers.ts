import axios from "axios";
import FormData from "form-data";
import { google, sheets_v4 } from "googleapis";

export async function getImgurToken(): Promise<string> {
  const res = await axios.post(
    `https://api.imgur.com/oauth2/token`,
    {
      refresh_token: process.env.IMGUR_REFRESH_TOKEN,
      client_id: process.env.IMGUR_CLIENT_ID,
      client_secret: process.env.IMGUR_CLIENT_SECRET,
      grant_type: "refresh_token",
    },
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return res.data.access_token;
}

export async function uploadFileToImgur(
  imageURL: string,
  imgurToken: string
): Promise<string> {
  const form = new FormData();
  console.info(imageURL);
  form.append("image", imageURL);
  form.append("description", "TEST");
  const res = await axios.request({
    method: "post",
    url: "https://api.imgur.com/3/image",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${imgurToken}`,
    },
    data: form,
  });
  return res.data.data.link;
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
