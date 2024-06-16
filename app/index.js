import { createElement as h } from "../lib/react.js";
import DreamsPage from "./DreamsPage.js";
import MainLayout from "./MainLayout.js";

export default function RootPage() {
  return h(
    "html",
    { lang: "en", className: "server-component" },
    h(
      "head",
      {},
      h("meta", { charset: "UTF-8" }),
      h("title", {}, "App"),
      h("link", {
        rel: "icon",
        type: "image/png",
        href: "data:image/png;base64,iVBORw0KGgo=",
      }),
      h("link", {
        rel: "stylesheet",
        href: "./styles.css",
      }),
    ),
    h("body", {}, h(MainLayout, null, h(DreamsPage))),
  );
}
