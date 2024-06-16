export function createElement(type, props, ...children) {
  return { 
    $$typeof: Symbol.for("react.element"),
    type, 
    props: {...props, children },
  };
}

let state = undefined;
export function useState(initialState) {
  state = state !== undefined ? state : initialState;
  const setState = (updater) => {
    state = updater(state);
  };
  return [state, setState];
}