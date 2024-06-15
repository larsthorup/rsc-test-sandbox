import { createElement as h } from "../lib/react.js";
import { getRandomDream } from "./getRandomDream.js";

export default async function DreamsPage() {
  const dream = await getRandomDream();

  if (!dream) {
    return h("div", {}, "No dreams found");
  }

  return h(
    "div",
    { className: "server-component" },
    h("p", {}, "Here is a random dream:"),
    h("p", {}, dream.content)
  );
}
