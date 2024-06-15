export async function renderToString(reactNode) {
  if (typeof reactNode === 'string') {
    return reactNode;
  }
  return `<${reactNode.type}>${(await Promise.all(reactNode.children.map(renderToString))).join('')}</${reactNode.type}>`;
}

export async function renderServerSide(reactNode) {
  const html = await renderToString(reactNode);
  return { html, reactNode };
}
