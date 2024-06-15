import escapeHtml from "escape-html";

// Inspired by https://github.com/reactwg/server-components/discussions/5

export async function renderFromJsx(jsx) {
  if (
    typeof jsx === "string" ||
    typeof jsx === "number" ||
    typeof jsx === "boolean" ||
    jsx == null
  ) {
    // Don't need to do anything special with these types.
    return jsx;
  } else if (Array.isArray(jsx)) {
    // Process each item in an array.
    return Promise.all(jsx.map((child) => renderFromJsx(child)));
  } else if (jsx != null && typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "string") {
        // This is a component like <div />.
        // Go over its props to make sure they can be turned into JSON.
        return {
          ...jsx,
          props: await renderFromJsx(jsx.props),
        };
      } else if (typeof jsx.type === "function") {
        // This is a custom React component (like <Footer />).
        // Call its function, and repeat the procedure for the JSX it returns.
        const Component = jsx.type;
        const props = jsx.props;
        const returnedJsx = await Component(props);
        return renderFromJsx(returnedJsx);
      } else throw new Error(`Cannot render: ${JSON.stringify(jsx)}`);
    } else {
      // This is an arbitrary object (for example, props, or something inside of them).
      // Go over every value inside, and process it too in case there's some JSX in it.
      // Skip function props - they will have to be hydrated client-side
      return Object.fromEntries(
        await Promise.all(
          Object.entries(jsx)
            .filter(([propName, value]) => typeof value !== "function")
            .map(async ([propName, value]) => [
              propName,
              await renderFromJsx(value),
            ])
        )
      );
    }
  } else throw new Error("Not implemented");
}

export async function renderToHtml(reactNode) {
  if (typeof reactNode === "string" || typeof reactNode === "number") {
    // This is a string. Escape it and put it into HTML directly.
    return escapeHtml(String(reactNode));
  } else if (reactNode == null || typeof reactNode === "boolean") {
    // This is an empty node. Don't emit anything in HTML for it.
    return "";
  } else if (Array.isArray(reactNode)) {
    // This is an array of nodes. Render each into HTML and concatenate.
    return (await Promise.all(reactNode.map((child) => renderToHtml(child)))).join(
      ""
    );
  } else if (typeof reactNode === "object") {
    // Check if this object is a React JSX element (e.g. <div />).
    if (reactNode.$$typeof === Symbol.for("react.element")) {
      if (typeof reactNode.type === "string") {
        // Is this a tag like <div>?
        // Turn it into an an HTML tag.
        let html = "<" + reactNode.type;
        for (const propName in reactNode.props) {
          if (reactNode.props.hasOwnProperty(propName) && propName !== "children") {
            const htmlPropName = propName === "className" ? "class" : propName;
            html += ` ${htmlPropName}="${renderProptoHtml(reactNode, propName)}"`;
          }
        }
        html += ">";
        html += await renderToHtml(reactNode.props.children);
        html += "</" + reactNode.type + ">";
        return html;
      } else if (typeof reactNode.type === "function") {
        // Is it a component like <BlogPostPage>?
        // Call the component with its props, and turn its returned JSX into HTML.
        const Component = reactNode.type;
        const props = reactNode.props;
        const returnedJsx = await Component(props);
        return await renderToHtml(returnedJsx);
      } else throw new Error("Not implemented.");
    }
  } else throw new Error("Not implemented.");
}

function renderProptoHtml(jsx, propName) {
  const prop = jsx.props[propName];
  if (propName === "style" && typeof prop === "object") {
    const css = Object.entries(prop)
      .map(([prop, value]) => `${cssPropName(prop)}:${value}`)
      .join(";");
    return escapeHtml(css);
  } else {
    return escapeHtml(prop);
  }
}

function cssPropName(prop) {
  switch (prop) {
    case "backgroundColor":
      return "background-color";
    default:
      return prop;
  }
}

export async function renderServerSide(jsx) {
  const reactNode = await renderFromJsx(jsx);
  // console.log(JSON.stringify(reactNode, null, 2));
  const html = await renderToHtml(reactNode);
  return { html, reactNode: jsx };
}
