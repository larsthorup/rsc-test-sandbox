import { hydrateRoot } from "./react-dom-client.js";
import { renderServerSide } from "./react-dom-server.js";

export async function render(reactNode) {
  const clientScripts = [];
  // TODO: server rendering should happen in a separate module environment
  const { html } = await renderServerSide(reactNode, clientScripts);
  const rootElement = document.createElement("div");
  rootElement.innerHTML = html;
  hydrateRoot(rootElement, reactNode);
  return rootElement;
}
