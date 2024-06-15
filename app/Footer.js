import { createElement as h } from "../lib/react.js";

export default function Footer() {
  return h(
    "footer",
    { className: "server-component" },
    h(
      "div",
      {},
      h(
        "a",
        {
          target: "_blank",
          href: "https://github.com/larsthorup/rsc-next-sandbox",
        },
        "Edit on GitHub"
      )
    )
  );
}
