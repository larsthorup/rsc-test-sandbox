function isTruthy(value) {
  return !!value;
}

export function createElement(type, props, ...children) {
  if (Array.isArray(children[0])) {
    console.error('createElement', type, props, ...children);
    throw new Error(`A child should not be an array. Did you pass "children" instead of "...children"?`);
  }
  return { 
    $$typeof: Symbol.for("react.element"),
    type, 
    props: {
      ...props, 
      children: children.filter(isTruthy).map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ) 
    },
  };
}

const createTextElement = (text) => {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
};

let local = {};
export function initializeHooks({ useState }) {
  local.useState = useState;
}

export function useState(initialState) {
  return local.useState(initialState);
}