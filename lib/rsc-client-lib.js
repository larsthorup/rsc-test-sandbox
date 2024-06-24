export async function importClientComponents(reactNode) {
  const elements = reactNode.props.children;
  for (const element of elements) {
    if (element.type === undefined && element.name) {
      const modulePath = `../app/${element.name}.js`;
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

