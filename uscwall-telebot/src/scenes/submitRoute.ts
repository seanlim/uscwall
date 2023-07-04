import { Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { SUBMIT_MESSAGE } from "../constants";

const { enter, leave } = Scenes.Stage;

// Submit Route Scene
const submitRouteScene = new Scenes.BaseScene<Scenes.SceneContext>("submit");

submitRouteScene.enter((ctx) =>
  ctx.reply(SUBMIT_MESSAGE, { parse_mode: "MarkdownV2" })
);
submitRouteScene.leave((ctx) => ctx.reply("Cancelled Route Submission"));
submitRouteScene.on(message("photo"), (ctx) => {
  console.debug(ctx.update.message.photo);
});
submitRouteScene.command("cancel", leave<Scenes.SceneContext>());

export default submitRouteScene;
