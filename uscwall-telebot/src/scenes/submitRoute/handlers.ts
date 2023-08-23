import { Composer, Markup } from "telegraf";
import { USCBotContext } from "../..";
import { message } from "telegraf/filters";
import {
  Grades,
  GRADES_BUTTONS,
  Sectors,
  SECTORS_BUTTONS,
} from "../../constants";
import axios from "axios";
import FormData from "form-data";
import { google, sheets_v4 } from "googleapis";

export const uploadHandler = new Composer<USCBotContext>();
uploadHandler.on(message("text"), async (ctx) => {
  await ctx.reply("Please send an image.");
  return ctx.wizard.state;
});
uploadHandler.on(message("document"), async (ctx) => {
  await ctx.reply("Please send an image.");
  return ctx.wizard.state;
});
uploadHandler.on(message("photo"), async (ctx) => {
  const l = ctx.update.message.photo.length;
  if (l < 1) {
    console.error("no images");
    return ctx.scene.reenter();
  }
  ctx.scene.session.telegramFileID = ctx.update.message.photo[l - 1].file_id;
  await ctx.reply(
    "What is the grade of this route?",
    Markup.keyboard(GRADES_BUTTONS).oneTime()
  );
  return ctx.wizard.next();
});

export const gradeHandler = new Composer<USCBotContext>();
gradeHandler.on(message("text"), async (ctx) => {
  const inputText = ctx.message.text;
  if (!Object.values(Grades).includes(inputText)) {
    await ctx.reply(
      "Invalid input, please use inputs provided",
      Markup.keyboard(GRADES_BUTTONS).oneTime()
    );
    return ctx.wizard.state;
  }
  ctx.scene.session.routeGrade = inputText;
  await ctx.reply("What do you want to name this route?");
  return ctx.wizard.next();
});

export const nameHandler = new Composer<USCBotContext>();
nameHandler.on(message("text"), async (ctx) => {
  try {
    ctx.scene.session.routeName = ctx.message.text;
    await ctx.reply(
      "Which sector is this route at?",
      Markup.keyboard(SECTORS_BUTTONS).oneTime()
    );
    return ctx.wizard.next();
  } catch (error) {
    console.error(error);
  }
});

export const sectorHandler = new Composer<USCBotContext>();
sectorHandler.on(message("text"), async (ctx) => {
  try {
    const inputText = ctx.message.text;
    if (!Object.values(Sectors).includes(inputText)) {
      await ctx.reply(
        "Invalid input, please use inputs provided",
        Markup.keyboard(SECTORS_BUTTONS).oneTime()
      );
      return ctx.wizard.state;
    }
    ctx.scene.session.routeSector = inputText;
    await ctx.reply(
      `"${ctx.scene.session.routeName}", graded ${ctx.scene.session.routeGrade} at ${ctx.scene.session.routeSector} with fileID ${ctx.scene.session.telegramFileID}.`,
      Markup.inlineKeyboard([
        Markup.button.callback("Cancel", "cancel"),
        Markup.button.callback("Confirm", "confirm"),
      ])
    );
    return ctx.wizard.next();
  } catch (err) {
    console.error(err);
  }
});

async function getFilePath(fileID: string): Promise<string> {
  const res = await axios.get(
    `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/getFile?file_id=${fileID}`
  );
  if (typeof res === "object" && res != null) {
    return res.data.result.file_path;
  }
  throw new Error("JSON error");
}

async function getImgurToken(): Promise<string> {
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

async function uploadFileToImgur(imageURL: string, imgurToken: string) {
  const form = new FormData();
  console.info(imageURL);
  form.append("image", imageURL);
  form.append("description", "TEST");
  const res = await axios.request<
    {},
    {
      data: {
        id: string;
        title: string;
      };
      success: boolean;
    }
  >({
    method: "post",
    url: "https://api.imgur.com/3/image",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${imgurToken}`,
    },
    data: form,
  });
  return res;
}

async function createGoogleSheetsClient(): Promise<sheets_v4.Sheets> {
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

export const submissionHandler = new Composer<USCBotContext>();
submissionHandler.action("cancel", async (ctx) => {
  console.debug("Cancelled");
  await ctx.reply("Cancelled submission");
  return ctx.scene.leave();
});
submissionHandler.action("confirm", async (ctx) => {
  try {
    console.debug(`Submitting with fileID ${ctx.scene.session.telegramFileID}`);
    const fileID = ctx.scene.session.telegramFileID;
    const { routeGrade, routeName, routeSector } = ctx.scene.session;

    await ctx.reply("Uploading image...");
    // Obtain image from URL
    const path = await getFilePath(fileID);
    const imgURL = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${path}`;
    // Upload image to imgur
    await ctx.reply("Finalising submission...");
    const imgurToken = await getImgurToken();
    const r = await uploadFileToImgur(imgURL, imgurToken);
    const imageData = r.data;
    console.info(`imageData: ${JSON.stringify(imageData)}`);

    const client = await createGoogleSheetsClient();
    // const response = await client.spreadsheets.get({
    //   spreadsheetId: process.env.SPREADSHEET_ID,
    // });
    // const spreadSheet = response.data; // Entire DB
    // const sheets = spreadSheet.sheets; // DB tables

    // const request = {
    //   spreadsheetId: process.env.SPREADSHEET_ID,
    //   range: "submissions",
    //   valueInputOption: "USER_ENTERED",
    //   resource: {
    //     values: [
    //       [
    //         // [...Object.values(data)]
    //         "Image Link",
    //         ctx.scene.session.routeGrade,
    //         ctx.scene.session.routeSector,
    //         ctx.scene.session.routeName,
    //         ctx.from?.first_name,
    //         ctx.from?.username,
    //         new Date(),
    //         ctx.from?.id,
    //         0,
    //         "pending",
    //       ],
    //     ],
    //   },
    // };
    await client.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "submissions",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            // [...Object.values(data)]
            "Image Link",
            routeGrade,
            routeName,
            routeSector,
            ctx.from?.first_name,
            ctx.from?.username,
            new Date(),
            ctx.from?.id,
            0,
            "pending",
          ],
        ],
      },
    });
    console.log("Cells Appended");

    await ctx.reply(
      "Done! Your route should appear once we are done vetting it!"
    );
    return ctx.scene.leave();
  } catch (err) {
    console.error(err);
  }
});
