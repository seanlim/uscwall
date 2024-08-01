import { Composer, Markup } from "telegraf";
import { USCBotContext } from "../..";
import { message } from "telegraf/filters";
import {
  Grades,
  GRADES_BUTTONS,
  Sectors,
  SECTORS_BUTTONS,
  WORKSHEET_SUBMISSIONS,
} from "../../constants";
import { randomUUID } from "crypto";
import {
  createGoogleSheetsClient,
  getTelegramFilePath,
  insertIntoSheet,
  uploadFileToImgBB,
} from "../../helpers";
import messages from "~/messages";

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
  if (!Object.values(Grades).includes(ctx.message.text)) {
    await ctx.reply(
      "Invalid input, please use inputs provided",
      Markup.keyboard(GRADES_BUTTONS).oneTime()
    );
    return ctx.wizard.state;
  }
  ctx.scene.session.routeGrade = ctx.message.text;
  await ctx.reply("What do you want to name this route?");
  return ctx.wizard.next();
});

export const nameHandler = new Composer<USCBotContext>();
nameHandler.on(message("text"), async (ctx) => {
  ctx.scene.session.routeName = ctx.message.text;
  await ctx.reply(
    "Which sector is this route at?",
    Markup.keyboard(SECTORS_BUTTONS).oneTime()
  );
  return ctx.wizard.next();
});

export const sectorHandler = new Composer<USCBotContext>();
sectorHandler.on(message("text"), async (ctx) => {
  if (!Object.values(Sectors).includes(ctx.message.text)) {
    await ctx.reply(
      messages.invalid.useInputsProvided,
      Markup.keyboard(SECTORS_BUTTONS).oneTime()
    );
    return ctx.wizard.state;
  }
  ctx.scene.session.routeSector = ctx.message.text;
  await ctx.reply(
    `"${ctx.scene.session.routeName}", graded ${ctx.scene.session.routeGrade} at ${ctx.scene.session.routeSector}.`,
    Markup.inlineKeyboard([
      Markup.button.callback("Cancel", "cancel"),
      Markup.button.callback("Confirm", "confirm"),
    ])
  );
  return ctx.wizard.next();
});

export const submissionHandler = new Composer<USCBotContext>();
submissionHandler.action("cancel", async (ctx) => {
  await ctx.reply("Cancelled submission");
  return ctx.scene.leave();
});
submissionHandler.action("confirm", async (ctx) => {
  const {
    routeGrade,
    routeName,
    routeSector,
    telegramFileID: fileID,
  } = ctx.scene.session;
  await ctx.reply("Finalising your submission...");

  // Obtain image from URL
  const path = await getTelegramFilePath(fileID);
  const imgURL = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${path}`;

  await ctx.reply("Uploading image...");

  await ctx.reply(
    "Your route will be vetted by the team before it is made public, do allow a few days for this process."
  );

  // Upload
  try {
    const uploadedURL = await uploadFileToImgBB(imgURL);
    // Insert into worksheet
    await insertIntoSheet(WORKSHEET_SUBMISSIONS, [
      [
        randomUUID(),
        uploadedURL,
        routeGrade,
        routeSector,
        routeName,
        ctx.from?.first_name,
        ctx.from?.username,
        new Date(),
        ctx.from?.id,
        0,
        "pending",
      ],
    ]);
  } catch (err) {
    console.error(err);
    messages.error.internalError.forEach(async (m) => {
      await ctx.reply(m);
    });
    return ctx.scene.leave();
  }

  await ctx.reply("Done!");

  return ctx.scene.leave();
});
