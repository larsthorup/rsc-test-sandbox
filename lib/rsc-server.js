import { createServer } from "http";
import { renderServerSide, useState } from "./react-dom-server.js";
import { createElement, initializeHooks } from "./react.js";
import { readFileSync } from "fs";

async function rscServer(req, res) {
// TODO: generate react-client-manifest.json from `'use client';` with a node module loader hook
const clientComponentList = JSON.parse(readFileSync("./app/react-client-manifest.json", "utf8"));
  initializeHooks({ useState });
  const { default: Page } = await import("../app/index.js");
  try {
    console.log(req.url);
    if (req.url === "/") {
      const jsx = createElement(Page);
      const { html } = await renderServerSide(jsx, ["/lib/rsc-client-main.js"], clientComponentList);
      res.setHeader("Content-Type", "text/html");
      res.end(`<!DOCTYPE html>${html}`);
    } else if (req.url.endsWith('.js')) {
      const path = `./${req.url.slice(1)}`;
      res.setHeader("Content-Type", "application/javascript");
      res.end(readFileSync(path, "utf8"));
    } else if (req.url.endsWith(".css")) {
      const path = `./app/${req.url.slice(1)}`;
      res.setHeader("Content-Type", "text/css");
      res.end(readFileSync(path, "utf8"));
    } else {
      res.statusCode = 404;
      res.end();
    }
  } catch (err) {
    console.error(err);
    res.statusCode = err.statusCode ?? 500;
    res.end();
  }
}
createServer(rscServer).listen(7000);
console.log(`[${new Date().toISOString().substring(11, 19)}] http://localhost:7000/`);
