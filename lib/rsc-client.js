import { hydrateRoot } from "./react-dom-client.js";
import { reviveJSX } from "./react-jsx-client.js";

async function importClientComponents(reactNode) {
  const elements = reactNode.props.children;
  for (const element of elements) {
    if (element.type === undefined && element.name) {
      const modulePath = `/app/${element.name}.js`;
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

const reactNode = JSON.parse(globalThis.__INITIAL_CLIENT_JSX_STRING__, reviveJSX);
// console.log(reactNode);
await importClientComponents(reactNode);
// console.log('import completed');
hydrateRoot(document.getElementsByTagName('html')[0], reactNode);
console.log('hydration completed');

export {};