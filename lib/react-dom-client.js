export async function hydrateRoot(rootElement, reactNode) {
  // TODO: read modules (path) from rsc payload
  const modulePath = '/app/Outline.js';
  const module = await import(modulePath);
  // TODO: read components (export index) from rsc payload
  const Component = module["default"];
  // TODO: read component props from serialized react tree
  const text = 'Here are a few more dreams to check out:';
  const children = { type: 'TEXT_ELEMENT', props: { nodeValue: true } };

  // bespoke hydration of Outline component
  const selector = 'div.client-component';
  const domNode = rootElement.querySelector(selector);
  if (!domNode) throw new Error(`selector not found: ${selector}`);
  const domChildren = [...domNode.children];
  const [pNode] = domChildren;
  const props = { text, children };
  let clickHandler;
  const reconcile = () => {
    const reactNode = Component(props);
    const { onClick, children: [child] } = reactNode.props.children[0].props;
    while (domNode.firstChild) {
      domNode.removeChild(domNode.firstChild);
    }
    const newDomchildren = reactNode.props.children[1].props.nodeValue === false ? [pNode] : domChildren;
    newDomchildren.forEach((child) => domNode.appendChild(child));
    pNode.textContent = child.props.nodeValue;
    pNode.removeEventListener('click', clickHandler);
    clickHandler = () => {
      onClick();
      reconcile();
    };
    pNode.addEventListener('click', clickHandler);
  }
  reconcile();
}
