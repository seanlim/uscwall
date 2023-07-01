import { Scenes } from "telegraf";
import { SUBMIT_MESSAGE } from "../constants";

const { enter, leave } = Scenes.Stage;

// Submit Route Scene
const submitRouteScene = new Scenes.BaseScene<Scenes.SceneContext>("submit");

submitRouteScene.enter((ctx) => ctx.reply(SUBMIT_MESSAGE));
submitRouteScene.leave((ctx) => ctx.reply("Cancelled Submit Route"));
submitRouteScene.command("cancel", leave<Scenes.SceneContext>());

export default submitRouteScene;
