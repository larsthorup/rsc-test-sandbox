import { hydrateRoot } from "./react-dom-client.js";
import { reviveJSX } from "./react-jsx-client.js";

const reactNode = JSON.parse(globalThis.__INITIAL_CLIENT_JSX_STRING__, reviveJSX);
// console.log(reactNode);
await hydrateRoot(document, reactNode);
console.log('hydration completed');

export {};