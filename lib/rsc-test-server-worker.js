import { workerData, parentPort } from "worker_threads";
import { renderServerSide } from "./react-dom-server.js";

const { pagePath, clientScripts } = workerData;
const { html } = await renderServerSide(pagePath, clientScripts);

parentPort?.postMessage({ html });
