import { createElement as h } from "../lib/react.js";
import RandomDreamButton from "./RandomDreamButton.js";
import Outline from "./Outline.js";
import DreamList from "./DreamList.js";
import Link from "./Link.js";

export default function Sidebar() {
  return h(
    "section",
    { className: "server-component" },
    h(RandomDreamButton),
    h(
      Outline,
      { text: "Here are a few more dreams to check out:" },
      h(DreamList)
    ),
    h(Link, { href: "new" }, "Add your own")
  );
}
