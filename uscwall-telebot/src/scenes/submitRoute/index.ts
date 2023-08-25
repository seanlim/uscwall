import { Scenes } from "telegraf";
import { SUBMIT_MESSAGE, WELCOME_MESSAGE } from "../../constants";
import {
  gradeHandler,
  nameHandler,
  sectorHandler,
  submissionHandler,
  uploadHandler,
} from "./handlers";
import { USCBotContext } from "../..";

const submitRouteScene = new Scenes.WizardScene<USCBotContext>(
  "submit",
  async (ctx) => {
    await ctx.reply(SUBMIT_MESSAGE, { parse_mode: "MarkdownV2" });
    return ctx.wizard.next();
  },
  uploadHandler,
  gradeHandler,
  nameHandler,
  sectorHandler,
  submissionHandler
);

submitRouteScene.leave(async (ctx) =>
  ctx.reply(WELCOME_MESSAGE, { parse_mode: "MarkdownV2" })
);
submitRouteScene.command("cancel", async (ctx) => {
  return ctx.scene.leave();
});

export default submitRouteScene;
