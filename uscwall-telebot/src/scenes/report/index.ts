import { Scenes } from "telegraf";
import { USCBotContext } from "../..";
import {
  reportDescriptionHandler,
  reportImageHandler,
  reportSectorHandler,
} from "./handlers";
import messages from "~/messages";

const reportScene = new Scenes.WizardScene<USCBotContext>(
  "report",
  async (ctx) => {
    await ctx.reply(
      `*Report Issue*\nTo cancel your report\\, use /cancel\\.\nPlease give a detailed description of the issue\\:`,
      { parse_mode: "MarkdownV2" }
    );
    return ctx.wizard.next();
  },
  reportDescriptionHandler,
  reportSectorHandler,
  reportImageHandler
);

reportScene.leave(async (ctx) =>
  ctx.reply(messages.welcomeInstructions, { parse_mode: "MarkdownV2" })
);
reportScene.command("cancel", async (ctx) => {
  return ctx.scene.leave();
});

export default reportScene;
