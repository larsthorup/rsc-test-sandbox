export function renderToString(reactNode) {
  if (typeof reactNode === 'string') {
    return reactNode;
  }
  return `<${reactNode.type}>${reactNode.children.map(renderToString).join('')}</${reactNode.type}>`;
}
