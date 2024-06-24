import { hydrateRoot, useState } from "./react-dom-client.js";
import { renderServerSideInWorker } from "./react-dom-server.js";
import { reviveJSX } from "./react-jsx-client.js";
import { initialize } from "./react.js";
import { importClientComponents } from "./rsc-client-lib.js";


// Note: pollyfill requestIdleCallback for jsdom
window.requestIdleCallback = (cb) =>
  setTimeout(() => cb({ timeRemaining: () => 50 }), 0);

export async function renderPage(pageModulePath) {
  const clientScripts = [];
  // TODO: adjust pageModulePath from being relative to app/App.test.js to being relative to lib/rsc-worker.js
  const { html } = await renderServerSideInWorker(
    pageModulePath,
    clientScripts
  );
  // console.log(document.documentElement.outerHTML)
  const rootElement = document.documentElement; // document.createElement("div");
  rootElement.innerHTML = html;
  // console.log(rootElement.tagName)
  // console.log(rootElement.outerHTML)
  const bodyElement = rootElement.lastChild;
  const scriptElement = bodyElement.lastChild; // Note: jsdom has moved the script tag inside body
  // console.log(scriptElement.tagName);
  const jsxInitScript = scriptElement.textContent
    ?.replace("globalThis.__INITIAL_CLIENT_JSX_STRING__ = '", "")
    ?.replace("';", "");
  // console.log(jsxInitScript);
  const reactNode = JSON.parse(jsxInitScript, reviveJSX);
  // console.log(JSON.stringify(reactNode, null, 2));
  await importClientComponents(reactNode);
  initialize({ useState });
  hydrateRoot(rootElement, reactNode);
  return rootElement;
}
