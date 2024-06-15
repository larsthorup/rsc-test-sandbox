import { expect, it } from "vitest";
import { getByText } from "@testing-library/dom";
// import { createElement } from "../lib/react-dom-client.js";
import { render } from "../lib/rsc-test.js";
import App from "./App.js";

// const h = createElement;

it('should server render to HTML then mount', () => {
  // const rootElement = render(h(App));
  const rootElement = render(App());
  expect(getByText(rootElement, 'Hello World!').tagName.toLowerCase()).toBe('p');
});
