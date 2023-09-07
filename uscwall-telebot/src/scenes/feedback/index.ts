import { Scenes } from "telegraf";
import { USCBotContext } from "../..";
import { WELCOME_MESSAGE } from "../../constants";
import { feedbackHandler, feedbackSubmitHandler } from "./handlers";

const feedbackScene = new Scenes.WizardScene<USCBotContext>(
  "feedback",
  async (ctx) => {
    await ctx.reply(
      `*Submit Feedback*\nTo cancel your submission\\, use /cancel\\.\nPlease send your feedback in one message\\:`,
      { parse_mode: "MarkdownV2" }
    );
    return ctx.wizard.next();
  },
  feedbackHandler,
  feedbackSubmitHandler
);

feedbackScene.leave(async (ctx) =>
  ctx.reply(WELCOME_MESSAGE, { parse_mode: "MarkdownV2" })
);
feedbackScene.command("cancel", async (ctx) => {
  return ctx.scene.leave();
});

export default feedbackScene;
