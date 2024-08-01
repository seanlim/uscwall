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
    await ctx.reply(messages.report.instructions, { parse_mode: "MarkdownV2" });
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
