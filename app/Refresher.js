'use client';
import { createElement as h, useState } from "../lib/react.js";

// TODO: auto-generate this function during hydration
async function refreshProxy() {
  const response = await fetch('/action/refreshDreamList');
  const jsx = await response.json();
  // TODO: hydrate JSX (e.g. Link components)
  return jsx;
}

export default function Refresher({ refresh, content: initialContent }) {
  const [content, setContent] = useState(initialContent);
  const onClick = async function () {
    const newContent = await (refresh || refreshProxy)();
    setContent(newContent);
  }
  return (
    h('div', {className: "client-component"},
      h('button', {onClick}, 'Refresh'),
      content
    )
  );
}