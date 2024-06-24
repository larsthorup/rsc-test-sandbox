function isTruthy(value) {
  return !!value;
}

export function createElement(type, props, ...children) {
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
export function initialize({ useState }) {
  local.useState = useState;
}

export function useState(initialState) {
  return local.useState(initialState);
}