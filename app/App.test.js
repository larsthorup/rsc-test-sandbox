import { expect, it } from "vitest";
import { getByText } from "@testing-library/dom";
import { createElement } from "../lib/react.js";
import { render } from "../lib/rsc-test.js";
import App from "./App.js";

const h = createElement;

it('should server render to HTML then mount', async () => {
  const rootElement = await render(h(App));
  expect(getByText(rootElement, 'Hello World!').tagName.toLowerCase()).toBe('p');
});
