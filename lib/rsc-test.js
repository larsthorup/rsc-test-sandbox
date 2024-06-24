import { Worker } from "node:worker_threads";
import { initializeRscClient } from "./rsc-client.js";

// Note: pollyfill requestIdleCallback for jsdom
window.requestIdleCallback = (cb) =>
  setTimeout(() => cb({ timeRemaining: () => 50 }), 0);

export function renderServerSideInWorker(pageModulePath, clientScripts) {
  // TODO: Promise.withResolvers
  const workerData = { pageModulePath, clientScripts };
  return new Promise((resolve, reject) => {
    const worker = new Worker("./lib/rsc-test-server-worker.js", {
      workerData,
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

export async function renderPage(pageModulePath) {
  const clientScripts = [];
  // TODO: adjust pageModulePath from being relative to app/App.test.js to being relative to lib/rsc-worker.js
  const { html } = await renderServerSideInWorker(
    pageModulePath,
    clientScripts
  );
  const rootElement = document.documentElement; // document.createElement("div");
  rootElement.innerHTML = html;
  const bodyElement = rootElement.lastChild;
  const scriptElement = bodyElement.lastChild; // Note: jsdom has moved the script tag inside body
  eval(scriptElement.textContent); // Note: by default, jsdom doesn't evaluate script tags
  await initializeRscClient(rootElement);
  return rootElement;
}
