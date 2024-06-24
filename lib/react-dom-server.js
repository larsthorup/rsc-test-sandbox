import { readFileSync } from "fs";
import escapeHtml from "escape-html";
import { createElement, initializeHooks } from "./react.js";

// Inspired by https://github.com/reactwg/server-components/discussions/5

initializeHooks({ useState });

async function renderFromJsx(jsx, clientComponentList) {
  if (
    typeof jsx === "string" ||
    typeof jsx === "number" ||
    typeof jsx === "boolean" ||
    jsx == null
  ) {
    // Don't need to do anything special with these types.
    return jsx;
  } else if (Array.isArray(jsx)) {
    // Process each item in an array.
    return Promise.all(jsx.map((child) => renderFromJsx(child, clientComponentList)));
  } else if (jsx != null && typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        // This is a component like <div />.
        // Go over its props to make sure they can be turned into JSON.
        return {
          ...jsx,
          props: await renderFromJsx(jsx.props, clientComponentList),
        };
      } else if (typeof jsx.type === "function") {
        if (clientComponentList.includes(jsx.type.name)) {
          // This is a client component (like <BlogPostPage />).
          // It will be invoked only when generating HTML (in renderToHtml or in react-dom-client).
          // We need to render it's props now, so that they can be serialized.
          return {
            name: jsx.type.name,
            ...jsx,
            props: await renderFromJsx(jsx.props, clientComponentList),
          };
        } else {
          // This is a React Server Component (like <Footer />).
          // Call its function, and repeat the procedure for the JSX it returns.
          const Component = jsx.type;
          const props = jsx.props;
          const returnedJsx = await Component(props);
          return renderFromJsx(returnedJsx, clientComponentList);
        }
      } else throw new Error(`Cannot render: ${JSON.stringify(jsx)}`);
    } else if (jsx.type === 'TEXT_ELEMENT') {
      // This is a text element. Don't need to do anything special with it.
      return jsx;
    } else {
      // This is an arbitrary object (for example, props, or something inside of them).
      // Go over every value inside, and process it too in case there's some JSX in it.
      // Skip function props - they will have to be hydrated client-side
      return Object.fromEntries(
        await Promise.all(
          Object.entries(jsx)
            .filter(([, value]) => typeof value !== "function")
            .map(async ([propName, value]) => [
              propName,
              await renderFromJsx(value, clientComponentList),
            ])
        )
      );
    }
  } else throw new Error("Not implemented");
}

export async function renderToHtml(jsx) {
  if (typeof jsx === "string" || typeof jsx === "number") {
    // This is a string. Escape it and put it into HTML directly.
    return escapeHtml(String(jsx));
  } else if (jsx == null || typeof jsx === "boolean") {
    // This is an empty node. Don't emit anything in HTML for it.
    return "";
  } else if (Array.isArray(jsx)) {
    // This is an array of nodes. Render each into HTML and concatenate.
    return (await Promise.all(jsx.map((child) => renderToHtml(child)))).join(
      ""
    );
  } else if (typeof jsx === "object") {
    // Check if this object is a React JSX element (e.g. <div />).
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        // Is this a tag like <div>?
        // Turn it into an an HTML tag.
        let html = "<" + jsx.type;
        for (const propName in jsx.props) {
          if (jsx.props.hasOwnProperty(propName) && propName !== "children" && !propName.startsWith("on")) {
            html += ` ${htmlPropName(propName)}="${renderProptoHtml(
              jsx,
              propName
            )}"`;
          }
        }
        html += ">";
        html += await renderToHtml(jsx.props.children);
        html += "</" + jsx.type + ">";
        return html;
      } else if (typeof jsx.type === "function") {
        // Is it a component like <BlogPostPage>?
        // Call the component with its props, and turn its returned JSX into HTML.
        const Component = jsx.type;
        const props = jsx.props;
        const returnedJsx = await Component(props);
        return await renderToHtml(returnedJsx);
      } else {
        throw new Error("Not implemented.");
      }
    } else if (jsx.type === 'TEXT_ELEMENT') {
      // This is a text element. Put its text content into HTML directly.
      return escapeHtml(jsx.props.nodeValue);
    } else {
      throw new Error("Not implemented.");
    }
  } else {
    throw new Error("Not implemented.");
  }
}

function renderProptoHtml(jsx, propName) {
  const prop = jsx.props[propName];
  if (propName === "style" && typeof prop === "object") {
    const css = Object.entries(prop)
      .map(([prop, value]) => `${cssPropName(prop)}:${value}`)
      .join(";");
    return escapeHtml(css);
  } else {
    return escapeHtml(prop);
  }
}

function htmlPropName(propName) {
  return propName === "className" ? "class" : propName;
}

function cssPropName(prop) {
  switch (prop) {
    case "backgroundColor":
      return "background-color";
    default:
      return prop;
  }
}

function stringifyJSX(key, value) {
  if (value === Symbol.for("react.element")) {
    // We can't pass a symbol, so pass our magic string instead.
    return "$RE"; // Could be arbitrary. I picked RE for React Element.
  } else if (typeof value === "string" && value.startsWith("$")) {
    // To avoid clashes, prepend an extra $ to any string already starting with $.
    return "$" + value;
  } else {
    return value;
  }
}

function injectClientScript(reactNode, clientScripts) {
  if (reactNode.type === "html" && Array.isArray(reactNode.props.children)) {
    for (const src of clientScripts) {
      reactNode.props.children.push(
        createElement("script", { type: "module", src })
      );
    }
  }
}

export async function renderServerSide(pagePath, clientScripts) {
  const pageModulePath = `../app${pagePath}index.js`; // Note: relative to location of this file
  const { default: Page } = await import(pageModulePath);
  // TODO: generate react-client-manifest.json from `'use client';` with a node module loader hook
  const manifestPath = "./app/react-client-manifest.json"; // Note: relative to working directory
  const clientComponentList = JSON.parse(
    readFileSync(manifestPath, "utf8")
  );
  const jsx = createElement(Page);
  const reactNode = await renderFromJsx(jsx, clientComponentList);
  // console.log(JSON.stringify(reactNode, null, 2));
  injectClientScript(reactNode, clientScripts);
  let html = await renderToHtml(reactNode);
  const jsxStringified = JSON.stringify(reactNode, stringifyJSX);
  const jsxStringifiedHtmlEscaped = jsxStringified.replace(/</g, "\\u003c");
  const jsxInitScript = `globalThis.__INITIAL_CLIENT_JSX_STRING__ = '${jsxStringifiedHtmlEscaped}';`;
  html = html.replace('</html>', `<script>${jsxInitScript}</script></html>`); 
  return { html, reactNode };
}

export function useState(initialState) {
  return [initialState, () => {}];
}
