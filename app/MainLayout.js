import { createElement as h } from "../lib/react.js";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Sidebar from "./Sidebar.js";

export default function MainLayout({ children }) {
  return h(
    "main",
    { className: "server-component" },
    h(Header),
    h("div", {}, h(Sidebar), h("section", {}, ...children)),
    h(Footer)
  );
}
