import { hydrateRoot, useState } from "./react-dom-client.js";
import { reviveJSX } from "./react-jsx-client.js";
import { initialize } from "./react.js";
import { importClientComponents } from "./rsc-client-lib.js";

const reactNode = JSON.parse(globalThis.__INITIAL_CLIENT_JSX_STRING__, reviveJSX);
// console.log(reactNode);
await importClientComponents(reactNode);
// console.log('import completed');
initialize({ useState });
hydrateRoot(document.getElementsByTagName('html')[0], reactNode);
console.log('hydration completed');

export {};