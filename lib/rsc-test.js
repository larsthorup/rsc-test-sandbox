import { Worker } from "node:worker_threads";
import { initializeRscClient } from "./rsc-client.js";

// Note: pollyfill requestIdleCallback for jsdom
window.requestIdleCallback = (cb) =>
  setTimeout(() => cb({ timeRemaining: () => 50 }), 0);

export function renderServerSideInWorker(pagePath, clientScripts) {
  // TODO: Promise.withResolvers
  const workerData = { pagePath, clientScripts };
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

export async function renderPage(pagePath) {
  const clientScripts = []; // We initialize rsc client below as by default, jsdom will not load scripts
  const { html } = await renderServerSideInWorker(
    pagePath,
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
