import { hydrateRoot } from "./react-dom-client.js";

const reactNode = undefined; // TODO: read react tree from rsc payload
await hydrateRoot(document, reactNode);
console.log('hydration completed');

export {};