export function renderToString(reactNode) {
  if (typeof reactNode === 'string') {
    return reactNode;
  }
  return `<${reactNode.type}>${reactNode.children.map(renderToString).join('')}</${reactNode.type}>`;
}

export function renderServerSide(reactNode) {
  const html = renderToString(reactNode);
  return { html, reactNode };
}
