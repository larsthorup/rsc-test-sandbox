import { createElement } from "../lib/react.js";

const h = createElement;

export default function App() {
  return h('p', null, 'Hello World!');
}