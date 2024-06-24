import { workerData, parentPort } from "worker_threads";
import { createElement, initializeHooks } from "./react.js";
import { renderServerSide, useState } from "./react-dom-server.js";
import { readFileSync } from "fs";

const { pagePath, clientScripts } = workerData;
initializeHooks({ useState });
const pageModulePath = `../app${pagePath}index.js`; // Note: relative to location of this file
const { default: Page } = await import(pageModulePath);
// TODO: generate react-client-manifest.json from `'use client';` with a node module loader hook
const manifestPath = "./app/react-client-manifest.json"; // Note: relative to working directory
const clientComponentList = JSON.parse(
  readFileSync(manifestPath, "utf8")
);
const jsx = createElement(Page);
const { html } = await renderServerSide(
  jsx,
  clientScripts,
  clientComponentList
);

parentPort?.postMessage({ html });
