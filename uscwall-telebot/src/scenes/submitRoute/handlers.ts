import { Composer, Markup } from "telegraf";
import { USCBotContext } from "../..";
import { message } from "telegraf/filters";
import {
  GRADES_BUTTONS,
  Grades,
  SECTORS_BUTTONS,
  Sectors,
} from "../../constants";

export const uploadHandler = new Composer<USCBotContext>();
uploadHandler.on(message("photo"), async (ctx) => {
  const l = ctx.update.message.photo.length;
  if (l < 1) {
    console.error("no images");
    return;
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
  ctx.scene.session.routeName = ctx.message.text;
  await ctx.reply(
    "Which sector is this route at?",
    Markup.keyboard(SECTORS_BUTTONS).oneTime()
  );
  return ctx.wizard.next();
});

export const sectorHandler = new Composer<USCBotContext>();
sectorHandler.on(message("text"), async (ctx) => {
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
  console.debug("Cancelled");
  ctx.reply("Cancelled submission");
  return ctx.scene.leave();
});
submissionHandler.action("confirm", async (ctx) => {
  console.debug("Submitting");
  ctx.reply("Uploading image...");
  // TODO: Upload image to imgur
  ctx.reply("Finalising submission...");
  // TODO: Insert into sheet
  await ctx.reply(
    "Done! Your route should appear once we are done vetting it!"
  );
  return ctx.scene.leave();
});
