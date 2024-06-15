import { createServer } from "http";
import App from "../app/App.js";
import { renderServerSide } from "./react-dom-server.js";
import { createElement } from "./react.js";

async function rscServer(req, res) {
  try {
    console.log(req.url);
    if (req.url === "/") {
      const appReactNode = createElement(App);
      const { html: appHtml } = await renderServerSide(appReactNode);
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>App</title>
  <link rel="icon" type="image/png" href="data:image/png;base64,iVBORw0KGgo=">
</head>
<body>${appHtml}</body>
</html>`;
      res.setHeader("Content-Type", "text/html");
      res.end(html);
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
console.log("http://localhost:7000/");
