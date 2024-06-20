import { hydrateRoot } from "./react-dom-client.js";
import { renderServerSideInWorker } from "./react-dom-server.js";

export async function renderPage(pageModulePath) {
  const clientScripts = [];
  // TODO: adjust pageModulePath from being relative to app/App.test.js to being relative to lib/rsc-worker.js
  const { html } = await renderServerSideInWorker(
    pageModulePath,
    clientScripts
  );
  const rootElement = document.createElement("div");
  rootElement.innerHTML = html;
  const reactNode = undefined; // TODO: read react tree from rsc payload
  hydrateRoot(rootElement, reactNode);
  return rootElement;
}
