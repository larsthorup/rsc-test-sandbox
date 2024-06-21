import { hydrateRoot } from "./react-dom-client.js";
import { renderServerSideInWorker } from "./react-dom-server.js";
import { reviveJSX } from "./react-jsx-client.js";

export async function renderPage(pageModulePath) {
  const clientScripts = [];
  // TODO: adjust pageModulePath from being relative to app/App.test.js to being relative to lib/rsc-worker.js
  const { html } = await renderServerSideInWorker(
    pageModulePath,
    clientScripts
  );
  const rootElement = document.createElement("div");
  rootElement.innerHTML = html;
  const jsxInitScript = rootElement.lastChild?.textContent?.replace("globalThis.__INITIAL_CLIENT_JSX_STRING__ = '", '')?.replace("';", '')
  const reactNode = JSON.parse(jsxInitScript || '', reviveJSX);
  // console.log(JSON.stringify(reactNode, null, 2));
  hydrateRoot(rootElement, reactNode);
  return rootElement;
}
