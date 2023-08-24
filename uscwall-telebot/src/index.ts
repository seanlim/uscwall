import { Context, Markup, Scenes, Telegraf, session } from "telegraf";
import * as Dotenv from "dotenv";
import { InlineQueryResult } from "telegraf/typings/core/types/typegram";
import { SUBMIT_MESSAGE, WELCOME_MESSAGE } from "./constants";
import submitRouteScene, {
  SubmitWizardSessionData,
} from "./scenes/submitRoute";
Dotenv.config();

export interface USCBotContext extends Context {
  imgurToken: string;
  // declare scene type
  scene: Scenes.SceneContextScene<USCBotContext, SubmitWizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<USCBotContext>;
}

const stage = new Scenes.Stage<USCBotContext>([submitRouteScene], {
  ttl: 10,
});

const bot = new Telegraf<USCBotContext>(process.env.TELEGRAM_TOKEN ?? "");
bot.use(session());
bot.use(stage.middleware());

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.start((ctx) =>
  ctx.reply(WELCOME_MESSAGE, {
    parse_mode: "MarkdownV2",
  })
);

bot.command("submit", (ctx) => ctx.scene.enter("submit"));
bot.catch((err, ctx) => {
  console.error(err);
});

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
