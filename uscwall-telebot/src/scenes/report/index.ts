import { Scenes } from "telegraf";
import { USCBotContext } from "../..";
import { WELCOME_MESSAGE } from "../../constants";
import {
  reportDescriptionHandler,
  reportImageHandler,
  reportSectorHandler,
} from "./handlers";

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
  ctx.reply(WELCOME_MESSAGE, { parse_mode: "MarkdownV2" })
);
reportScene.command("cancel", async (ctx) => {
  return ctx.scene.leave();
});

export default reportScene;
