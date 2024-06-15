import { createElement as h } from "../lib/react.js";

export default function Header() {
  return h(
    "header",
    { className: "server-component" },
    h("div", {}, h("h1", {}, h("span", {}, "Dreams")))
  );
}
