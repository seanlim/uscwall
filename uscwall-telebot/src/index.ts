import Express from "express";
import { Context, Markup, Scenes, Telegraf, session } from "telegraf";
import * as Dotenv from "dotenv";
import { WELCOME_MESSAGE } from "./constants";
import submitRouteScene from "./scenes/submitRoute";
import reportScene from "./scenes/report";

Dotenv.config();

export interface WizardSessionData extends Scenes.WizardSessionData {
  // Route submission
  routeName: string;
  routeGrade: string;
  routeSector: string;
  // Reporting
  reportDescription: string;
  reportSector: string;
  reportHasImage: boolean;
  // For uploads
  telegramFileID: string;
}
export interface USCBotContext extends Context {
  imgurToken: string;
  // declare scene type
  scene: Scenes.SceneContextScene<USCBotContext, WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<USCBotContext>;
}

const stage = new Scenes.Stage<USCBotContext>([submitRouteScene, reportScene]);

const bot = new Telegraf<USCBotContext>(process.env.TELEGRAM_TOKEN ?? "");
bot.use(session());
bot.use(stage.middleware());

bot.command("quit", async (ctx) => {
  // Explicit usage
  await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  await ctx.leaveChat();
});

bot.start(async (ctx) => {
  await ctx.reply(WELCOME_MESSAGE, {
    parse_mode: "MarkdownV2",
  });
});

bot.command("submit", (ctx) => ctx.scene.enter("submit"));
bot.command("report", (ctx) => ctx.scene.enter("report"));

bot.launch({
  allowedUpdates: ["message", "callback_query"],
});

const app = Express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(80, () => {
  console.log(`Express is listening on port 80`);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
