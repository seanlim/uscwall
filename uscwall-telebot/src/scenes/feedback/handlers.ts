import { Composer, Markup } from "telegraf";
import { USCBotContext } from "../..";
import { message } from "telegraf/filters";
import { insertIntoSheet } from "../../helpers";
import { WORKSHEET_FEEDBACKS } from "../../constants";
import { randomUUID } from "crypto";

export const feedbackHandler = new Composer<USCBotContext>();
feedbackHandler.on(message("text"), async (ctx) => {
  ctx.scene.session.feedbackDescription = ctx.message.text;
  await ctx.reply(
    `Your feedback:\n "${ctx.scene.session.feedbackDescription}"`,
    Markup.inlineKeyboard([
      Markup.button.callback("Cancel", "cancel"),
      Markup.button.callback("Confirm", "confirm"),
    ])
  );
  return ctx.wizard.next();
});

export const feedbackSubmitHandler = new Composer<USCBotContext>();
feedbackSubmitHandler;
feedbackSubmitHandler.action("cancel", async (ctx) => {
  await ctx.reply("Cancelled submission");
  return ctx.scene.leave();
});
feedbackSubmitHandler.action("confirm", async (ctx) => {
  const { feedbackDescription } = ctx.scene.session;
  await ctx.reply("Submitting your feedback...");
  try {
    await insertIntoSheet(WORKSHEET_FEEDBACKS, [
      [
        randomUUID(),
        feedbackDescription,
        ctx.from?.first_name,
        ctx.from?.username,
        new Date(),
        ctx.from?.id,
      ],
    ]);
  } catch (err) {
    console.error(err);
    await ctx.reply("Apologies, something went wrong.");
    await ctx.reply(
      "We are working to solve this issue, in the meantime feel free to try again."
    );
    return ctx.scene.leave();
  }
  await ctx.reply("Done! Thank you for your feedback!");

  return ctx.scene.leave();
});
