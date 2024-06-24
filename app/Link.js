'use client';
import { createElement as h } from "../lib/react.js";

export default function Link({ href, children }) {
  // const navigatePage = useNavigate();
  const onClick = () => {}; // () => navigatePage(href)
  return h("a", { onClick, className: "client-component" }, ...children);
}
