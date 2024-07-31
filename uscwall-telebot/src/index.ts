import Express from "express";
import { Context, Scenes, Telegraf, session } from "telegraf";
import * as Dotenv from "dotenv";
import submitRouteScene from "./scenes/submitRoute";
import reportScene from "./scenes/report";
import feedbackScene from "./scenes/feedback";
import messages from "./messages";

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
  // Feedback submission
  feedbackDescription: string;
  // For uploads
  telegramFileID: string;
}
export interface USCBotContext extends Context {
  // declare scene type
  scene: Scenes.SceneContextScene<USCBotContext, WizardSessionData>;
  // declare wizard type
  wizard: Scenes.WizardContextWizard<USCBotContext>;
}

const stage = new Scenes.Stage<USCBotContext>([
  submitRouteScene,
  reportScene,
  feedbackScene,
]);
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
  await ctx.reply(messages.welcomeInstructions, {
    parse_mode: "MarkdownV2",
  });
});
bot.command("submit", (ctx) => ctx.scene.enter("submit"));
bot.command("report", (ctx) => ctx.scene.enter("report"));
bot.command("feedback", (ctx) => ctx.scene.enter("feedback"));
bot.launch({
  allowedUpdates: ["message", "callback_query"],
});

const PORT = 8080;
const app = Express();
// For health check (https://docs.digitalocean.com/glossary/health-check/)
app.get("/", (req, res) => {
  res.sendStatus(200);
});
app.listen(PORT, () => {
  console.log(`Express is listening on port ${PORT}`);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
