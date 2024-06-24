import "./cycle.js";

// Note: inspired by https://pomb.us/build-your-own-react/

const createDom = (fiber) => {
  const dom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
};

const isEvent = (key) => key.startsWith('on');
const isProperty = (key) => key !== 'children' && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
const updateDom = (dom, prevProps, nextProps) => {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = '';
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
      // console.log('updateDom', { dom, name }, nextProps[name])
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      // console.log('updateDom', { dom, eventType }, nextProps[name])
      dom.addEventListener(eventType, nextProps[name]);
    });
};

const commitRoot = () => {
  internal.deletions.forEach((fiber) => commitDeletion(fiber, fiber.dom.parentNode));
  const fiber = internal.wipRoot.child;
  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;
  commitWork(fiber, domParent, 0);
  internal.currentRoot = internal.wipRoot;
  internal.wipRoot = null;
};

const commitWork = (fiber, domParent, domChildIndex) => {
  // console.log('commitWork', { fiber, domParent, domChildIndex });
  if (!fiber) return;
  // console.log('commitWork', fiber.type);
  const { children, ...propsWithoutChildren } = fiber.props;
  // const attributes = JSON.stringify([...domParent.attributes].map((a) => ({[a.name]: a.value})));
  // console.log(`commitWork: ${fiber.type} ${JSON.stringify(propsWithoutChildren)} ${domParent.tagName} ${attributes} ${domChildIndex}`)
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    // console.log('commitWork isFunctionComponent fiber.child', fiber.child)
    commitWork(fiber.child, domParent, domChildIndex); // TODO: this seems to be wrong when hydrating a function component
    // console.log('commitWork isFunctionComponent fiber.sibling', fiber.sibling)
    commitWork(fiber.sibling, domParent, domChildIndex + 1);
    // console.log('commitWork isFunctionComponent done', fiber.type)
  } else {
    if (fiber.effectTag === 'PLACEMENT' && fiber.dom === null) {
      // Note: hydration
      if (domParent.children.length === 0 && domParent.childNodes.length === 1) {
        // console.log('commitWork hydration text node')
        // Note: this handles only text nodes not mixed with HTML elements
        fiber.dom = domParent.childNodes[0];
        return; // Note: avoid recursing into the child text element
      } else {
        // if (fiber.type !== domParent.children[domChildIndex].nodeName.toLowerCase()) {
          // console.log(JSON.stringify(JSON.decycle(fiber, domReplacer), null, 2));
          // console.log('commitWork', fiber.type, '!==', domParent.children[domChildIndex].nodeName.toLowerCase())
        // }
        fiber.dom = domParent.children[domChildIndex];
      }
      if (fiber.dom) {
        updateDom(fiber.dom, {}, fiber.props);
      }
    } else if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
      domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === 'DELETION') {
      commitDeletion(fiber, domParent);
    } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
      updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    }
    // console.log('commitWork fiber.child', fiber.child, fiber.dom)
    commitWork(fiber.child, fiber.dom || domParent, 0); // TODO: this seems to be wrong when hydrating a function component
    // console.log('commitWork fiber.sibling', fiber.sibling)
    commitWork(fiber.sibling, domParent, domChildIndex + 1);
    // console.log('commitWork done', fiber.type)
  }
};

function commitDeletion(fiber, domParent) {
  // console.log('commitDeletion', { fiber, domParent });
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

export const createRoot = (element, container) => {
  internal.wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: internal.currentRoot,
  };
  internal.deletions = [];
  internal.nextUnitOfWork = internal.wipRoot;
  requestIdleCallback(workLoop);
};

const vdomSimplify = (vdom) => {
  if (vdom == null) return null;
  const { type, props, child, sibling } = vdom;
  const { children, ...propsWithoutChildren } = props;
  return { 
    type, 
    props: propsWithoutChildren,
    child: vdomSimplify(child),
    sibling: vdomSimplify(sibling),
  };
}

export const hydrateRoot = (domNode, reactNode) => {
  internal.wipRoot = {
    type: reactNode.type,
    props: reactNode.props,
    dom: domNode,
    alternate: internal.currentRoot,
  };
  // console.log('hydrateRoot', internal.wipRoot);
  internal.deletions = [];
  internal.nextUnitOfWork = internal.wipRoot;
  while (internal.nextUnitOfWork) {
    internal.nextUnitOfWork = performUnitOfWork(internal.nextUnitOfWork, true);
  }
  // console.log(internal.wipRoot);
  // console.log(JSON.stringify(vdomSimplify(internal.wipRoot), null, 2))
  // console.log(JSON.stringify(JSON.decycle(internal.wipRoot, domReplacer), null, 2));
  commitRoot();
  // console.log("Done hydrating!");
  // console.log(internal.currentRoot);
  // console.log(JSON.stringify(JSON.decycle(internal.currentRoot, domReplacer), null, 2));
  requestIdleCallback(workLoop);
};

const domReplacer = (value) => {
  if (value instanceof HTMLElement) {
    return value.outerHTML;
  } else if (value instanceof Text) {
    return value.textContent;
  }
  return value;
}

const workLoop = (deadline) => {
  let shouldYield = false;
  while (internal.nextUnitOfWork && !shouldYield) {
    internal.nextUnitOfWork = performUnitOfWork(internal.nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
    // console.log(deadline, internal.nextUnitOfWork);
  }
  if (!internal.nextUnitOfWork && internal.wipRoot) {
    // console.log(JSON.stringify(vdomSimplify(internal.wipRoot), null, 2))
    // console.log(JSON.stringify(JSON.decycle(internal.wipRoot, domReplacer), null, 2));
    commitRoot();
    // console.log(JSON.stringify(JSON.decycle(internal.currentRoot, domReplacer), null, 2));
  }
  requestIdleCallback(workLoop);
};

const performUnitOfWork = (fiber, hydrate) => {
  // console.log('performUnitOfWork', fiber, fiber.props.children)
  // console.log('performUnitOfWork', fiber.type)
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber, hydrate);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
};

// Note: to be used only by react.js
export const internal = {
  currentRoot: null,
  deletions: null,
  nextUnitOfWork: null,
  wipFiber: null,
  wipRoot: null,
  hookIndex: null,
};

const updateFunctionComponent = (fiber) => {
  internal.wipFiber = fiber;
  internal.hookIndex = 0;
  internal.wipFiber.hooks = [];
  const elements = [fiber.type(fiber.props)];
  // console.log('updateFunctionComponent', fiber, children);
  // if (Array.isArray(elements) && Array.isArray(elements[0])) {
    // console.log('updateFunctionComponent', fiber.type.name, { fiber, elements })
  // }
  reconcileChildren(fiber, elements);
};

const updateHostComponent = (fiber, hydrate) => {
  if (!hydrate && !fiber.dom) {
    // Note: hydration will happen in commitWork()
    fiber.dom = createDom(fiber);
  }
  const elements = fiber.props.children;
  // if (Array.isArray(elements) && Array.isArray(elements[0])) {
  //   console.log('updateHostComponent', { fiber, elements })
  // }
  reconcileChildren(fiber, elements);
};

const reconcileChildren = (wipFiber, elements) => {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  if (elements.length === 1 && Array.isArray(elements[0])) {
    elements = elements[0]; // TODO: avoid this hack!
  }
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    // TODO: add support for "key" to handle "moved" elements
    const sameType = oldFiber && element && element.type == oldFiber.type;
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: { ...element.props },
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE',
      };
    }
    if (element && !sameType) {
      if (Array.isArray(element.props.children) && Array.isArray(element.props.children[0])) {
        // console.log('reconcileChildren', { wipFiber, element })
        element.props.children = element.props.children[0]; // TODO: avoid this hack!
      }
      newFiber = {
        type: element.type,
        props: { ...element.props },
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }
    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      internal.deletions.push(oldFiber);
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
};

export const useState = (initialValue) => {
  const oldHook =
    internal.wipFiber.alternate &&
    internal.wipFiber.alternate.hooks &&
    internal.wipFiber.alternate.hooks[internal.hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initialValue,
    queue: [],
  };
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    const newState = action(hook.state);
    // console.log('useState action', hook.state, newState);
    hook.state = newState;
  });
  const setState = (action) => {
    hook.queue.push(action);
    internal.wipRoot = {
      dom: internal.currentRoot.dom,
      props: internal.currentRoot.props,
      alternate: internal.currentRoot,
    };
    internal.nextUnitOfWork = internal.wipRoot;
    internal.deletions = [];
    // console.log('setState', internal.nextUnitOfWork)
  };
  internal.wipFiber.hooks.push(hook);
  internal.hookIndex++;
  // console.log('useState', hook.state)
  return [hook.state, setState];
};
