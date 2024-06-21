import { workerData, parentPort } from "worker_threads";
import { createElement } from "../lib/react.js";
import { renderServerSide } from "./react-dom-server.js";
import { readFileSync } from "fs";

const { pageModulePath, clientScripts } = workerData;

const { default: Page } = await import(pageModulePath);
// TODO: generate react-client-manifest.json from `'use client';` with a node module loader hook
const clientComponentList = JSON.parse(readFileSync("./app/react-client-manifest.json", "utf8"));
const reactNode = createElement(Page);
const { html } = await renderServerSide(reactNode, clientScripts, clientComponentList);

parentPort?.postMessage({ html });
