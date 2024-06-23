import { createElement as h } from "../lib/react.js";
import { getDreams } from "./getDreams.js";
import Link from "./Link.js";

if (typeof window !== "undefined") {
  throw new Error("Server components must not run in the browser")
}

export default async function DreamList() {
  const dreams = await getDreams();
  const dreamsSorted = dreams.sort((a, b) => {
    return b.createdAt > a.createdAt ? 1 : -1;
  });
  return h(
    "div",
    { className: "server-component" },
    h(
      "ul",
      {},
      ...dreamsSorted.map(({ id, name }) => {
        return h(
          "li",
          { key: id },
          h(
            Link,
            { href: id },
            h("span", { className: "server-component" }, name)
          )
        );
      })
    ),
    h("small", {}, `(${new Date().toLocaleTimeString()})`)
  );
}
