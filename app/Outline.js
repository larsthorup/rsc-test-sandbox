// 'use client';
import { createElement as h } from "../lib/react.js";

export default function Outline({ text, children }) {
  const expanded = true; // const [expanded, setExpanded] = useState(true);
  const toggleExpanded = () => {}; // () => setExpanded((prev) => !prev);
  const symbol = expanded ? '▼' : '▶';
  return (
    h('div', {className: "client-component"}, 
      h('p', {onClick: toggleExpanded}, `${text} ${symbol}`),
      expanded && children
    )
  );
}