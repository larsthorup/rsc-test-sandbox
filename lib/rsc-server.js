import { createServer } from "http";
import { renderServerSide } from "./react-dom-server.js";
import { createElement } from "./react.js";
import { readFileSync } from "fs";

async function rscServer(req, res) {
  const { default: Page } = await import("../app/index.js");
  try {
    console.log(req.url);
    if (req.url === "/") {
      const appReactNode = createElement(Page);
      const { html } = await renderServerSide(appReactNode, ["/lib/rsc-client.js"]);
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
