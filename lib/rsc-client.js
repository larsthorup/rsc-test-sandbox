// TODO: read modules (path) from serialized react tree
const modulePath = '/app/Outline.js';
const module = await import(modulePath);
// TODO: read components (export index) from serialized react tree
const Component = module["default"];
// TODO: read component props from serialized react tree
const text = 'Here are a few more dreams to check out:';
const children = ['some', 'children'];

// bespoke hydration of Outline component
const selector = 'div.client-component';
const domNode = document.querySelector(selector);
if (!domNode) throw new Error(`selector not found: ${selector}`);
const domChildren = [...domNode.children];
const [pNode] = domChildren;
const props = { text, children };
let clickHandler;
const reconcile = () => {
  const reactNode = Component(props);
  const { onClick, children: [textContent] } = reactNode.props.children[0].props;
  while (domNode.firstChild) {
    domNode.removeChild(domNode.firstChild);
  }
  const newDomchildren = reactNode.props.children[1] === false ? [pNode] : domChildren;
  newDomchildren.forEach((child) => domNode.appendChild(child));
  pNode.textContent = textContent;
  pNode.removeEventListener('click', clickHandler);
  clickHandler = () => {
    onClick();
    reconcile();
  };
  pNode.addEventListener('click', clickHandler);
}
reconcile();

console.log('hydration completed');

export {};