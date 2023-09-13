import { Composer, Markup } from "telegraf";
import { USCBotContext } from "../..";
import { message } from "telegraf/filters";
import { SECTORS_BUTTONS, Sectors, WORKSHEET_REPORTS } from "../../constants";
import {
  createGoogleSheetsClient,
  getTelegramFilePath,
  insertIntoSheet,
  uploadFileToImgBB,
} from "../../helpers";
import { randomUUID } from "crypto";

export const reportDescriptionHandler = new Composer<USCBotContext>();
reportDescriptionHandler.on(message("text"), async (ctx) => {
  ctx.scene.session.reportDescription = ctx.message.text;
  await ctx.reply(
    "Which sector did you find this issue at?",
    Markup.keyboard(SECTORS_BUTTONS).oneTime()
  );
  return ctx.wizard.next();
});

export const reportSectorHandler = new Composer<USCBotContext>();
reportSectorHandler.on(message("text"), async (ctx) => {
  if (!Object.values(Sectors).includes(ctx.message.text)) {
    await ctx.reply(
      "Invalid input, please use inputs provided",
      Markup.keyboard(SECTORS_BUTTONS).oneTime()
    );
    return ctx.wizard.state;
  }
  ctx.scene.session.reportSector = ctx.message.text;
  await ctx.reply(
    "Please submit an image of this issue (if needed):",
    Markup.inlineKeyboard([Markup.button.callback("Skip", "skip")])
  );
  return ctx.wizard.next();
});

export const reportImageHandler = new Composer<USCBotContext>();
reportImageHandler.action("skip", async (ctx) => {
  const { reportSector, reportDescription } = ctx.scene.session;
  await ctx.reply("Uploading report...");
  // Insert into sheet
  await insertIntoSheet(WORKSHEET_REPORTS, [
    [
      randomUUID(),
      "",
      reportSector,
      reportDescription,
      ctx.from?.first_name,
      ctx.from?.username,
      new Date(),
      ctx.from?.id,
      "NEW",
    ],
  ]);
  return ctx.scene.leave();
});
reportImageHandler.on(message("text"), async (ctx) => {
  await ctx.reply("Please send an image.");
  return ctx.wizard.state;
});
reportImageHandler.on(message("document"), async (ctx) => {
  await ctx.reply("Please send an image.");
  return ctx.wizard.state;
});
reportImageHandler.on(message("photo"), async (ctx) => {
  const { reportSector, reportDescription } = ctx.scene.session;

  const l = ctx.update.message.photo.length;
  if (l < 1) {
    console.error("no images");
    return ctx.scene.reenter();
  }
  const fileID = ctx.update.message.photo[l - 1].file_id;
  await ctx.reply("Finalising report...");

  // Upload
  // Obtain image from URL
  const path = await getTelegramFilePath(fileID);
  const imgURL = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${path}`;

  // TODO: add confirm step
  await ctx.reply("Uploading report...");

  // Upload image to imgur
  const uploadedURL = await uploadFileToImgBB(imgURL);

  // Add to Sheet
  await insertIntoSheet(WORKSHEET_REPORTS, [
    [
      randomUUID(),
      uploadedURL,
      reportSector,
      reportDescription,
      ctx.from?.first_name,
      ctx.from?.username,
      new Date(),
      ctx.from?.id,
      "NEW",
    ],
  ]);
  console.log("Cells Appended");

  return ctx.scene.leave();
});
