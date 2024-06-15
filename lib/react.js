export function createElement(type, props, ...children) {
  return { 
    $$typeof: Symbol.for("react.element"),
    type, 
    props: {...props, children },
  };
}
