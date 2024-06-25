'use client';
import { createElement as h, useState } from "../lib/react.js";

export default function Refresher({ refresh, content: initialContent }) {
  const [content, setContent] = useState(initialContent);
  const onClick = async function () {
    setContent(await refresh());
  }
  return (
    h('div', {className: "client-component"},
      h('button', {onClick}, 'Refresh'),
      content
    )
  );
}