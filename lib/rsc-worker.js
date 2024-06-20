import { workerData, parentPort } from "worker_threads";
import { createElement } from "../lib/react.js";
import { renderServerSide } from "./react-dom-server.js";

const { pageModulePath, clientScripts } = workerData;

const { default: Page } = await import(pageModulePath);
const reactNode = createElement(Page);
const { html } = await renderServerSide(reactNode, clientScripts);

parentPort?.postMessage({ html });
