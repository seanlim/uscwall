import { Telegraf } from "telegraf";
import * as Dotenv from "dotenv";
import { InlineQueryResult } from "telegraf/typings/core/types/typegram";
import { WELCOME_MESSAGE } from "./constants";
Dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN ?? "");

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.start((ctx) => ctx.reply(WELCOME_MESSAGE));

// bot.on("text", async (ctx) => {
//   console.info(ctx);
//   // Explicit usage
//   await ctx.telegram.sendMessage(
//     ctx.message.chat.id,
//     `Hello ${ctx.state.role}`
//   );

//   // Using context shortcut
//   await ctx.reply(WELCOME_MESSAGE);
// });

bot.on("callback_query", async (ctx) => {
  // Explicit usage
  await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

  // Using context shortcut
  await ctx.answerCbQuery();
});

bot.on("inline_query", async (ctx) => {
  const result: readonly InlineQueryResult[] = [];
  // Explicit usage
  await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

  // Using context shortcut
  await ctx.answerInlineQuery(result);
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
