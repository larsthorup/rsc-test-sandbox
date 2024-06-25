import { createElement as h } from "../lib/react.js";
import RandomDreamButton from "./RandomDreamButton.js";
import Outline from "./Outline.js";
import DreamList from "./DreamList.js";
import Link from "./Link.js";
import refreshDreamList from "./refreshDreamList.js";
import Refresher from "./Refresher.js";

export default async function Sidebar() {
  const dreamList = await refreshDreamList();
  console.log({refreshDreamList}, refreshDreamList.toString().includes("'use server';"));
  return h(
    "section",
    { className: "server-component" },
    h(RandomDreamButton),
    h(
      Outline,
      { text: "Here are a few more dreams to check out:" },
      h(DreamList)
    ),
    h(
      Refresher,
      { content: dreamList, refresh: refreshDreamList}
    ),
    h(Link, { href: "new" }, "Add your own")
  );
}
