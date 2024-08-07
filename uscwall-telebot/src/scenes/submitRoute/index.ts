import { Scenes } from "telegraf";
import {
  gradeHandler,
  nameHandler,
  sectorHandler,
  submissionHandler,
  uploadHandler,
} from "./handlers";
import { USCBotContext } from "../..";
import messages from "~/messages";

const submitRouteScene = new Scenes.WizardScene<USCBotContext>(
  "submit",
  async (ctx) => {
    await ctx.reply(messages.submit.instructions, { parse_mode: "MarkdownV2" });
    return ctx.wizard.next();
  },
  uploadHandler,
  gradeHandler,
  nameHandler,
  sectorHandler,
  submissionHandler
);

submitRouteScene.leave(async (ctx) =>
  ctx.reply(messages.welcomeInstructions, { parse_mode: "MarkdownV2" })
);
submitRouteScene.command("cancel", async (ctx) => {
  return ctx.scene.leave();
});

export default submitRouteScene;
