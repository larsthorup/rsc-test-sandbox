export function createElement(type, props, ...children) {
  return { 
    $$typeof: Symbol.for("react.element"),
    type, 
    props: {
      ...props, 
      children: children.map((child) =>
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

let state = undefined;
export function useState(initialState) {
  state = state !== undefined ? state : initialState;
  const setState = (updater) => {
    state = updater(state);
  };
  return [state, setState];
}