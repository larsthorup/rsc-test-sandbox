import { hydrateRoot } from "./react-dom-client.js";
import { renderToString } from "./react-dom-server.js";

export function renderServer(reactNode) {
  const html = renderToString(reactNode);
  return { html, reactNode };
}

export function render(reactNode) {
  const { html } = renderServer(reactNode);
  const rootElement = document.createElement("div");
  rootElement.innerHTML = html;
  // hydrateRoot(rootElement, reactNode);
  return rootElement;
}
