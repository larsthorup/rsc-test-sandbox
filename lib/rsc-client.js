import { hydrateRoot, useState } from "./react-dom-client.js";
import { reviveJSX } from "./react-jsx-client.js";
import { initializeHooks } from "./react.js";

async function importClientComponents(reactNode) {
  const elements = reactNode.props.children;
  for (const element of elements) {
    if (element.type === undefined && element.name) {
      const modulePath = `../app/${element.name}.js`;
      const module = await import(modulePath);
      const Component = module["default"];
      element.type = Component;
      delete element.name;
    }
    if (element.props.children) {
      await importClientComponents(element);
    }
  }
}

export async function initializeRscClient(rootElement) {
  const reactNode = JSON.parse(__INITIAL_CLIENT_JSX_STRING__, reviveJSX);
  await importClientComponents(reactNode);
  initializeHooks({ useState });
  hydrateRoot(rootElement, reactNode);
}