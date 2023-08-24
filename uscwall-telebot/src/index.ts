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

const stage = new Scenes.Stage<USCBotContext>([submitRouteScene]);

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

bot.launch({
  allowedUpdates: ["message", "callback_query"],
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
