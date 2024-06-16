// TODO: read modules (path) from serialized react tree
const modulePath = '/app/Outline.js';
const module = await import(modulePath);
// TODO: read components (export index) from serialized react tree
const Component = module["default"];
// TODO: read component props from serialized react tree
const selector = 'div.client-component > p:nth-child(1)';
const textNode = document.querySelector(selector);
if (!textNode) throw new Error(`selector not found: ${selector}`);
const text = textNode.textContent;
const props = { text };
const reactNode = Component(props);
// console.log(JSON.stringify(reactNode, null, 2));
// hydrate DOM-node with react-tree (onClick)
const { onClick, children } = reactNode.props.children[0].props;
textNode.textContent = children[0];
textNode?.addEventListener('click', onClick);

console.log('hydration completed');

export {};