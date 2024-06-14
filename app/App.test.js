import { expect, it } from "vitest";
import { getByText } from "@testing-library/dom";
import { createElement } from "../lib/react-dom-client.js";
import { render } from "../lib/rsc-test.js";

const h = createElement;

it('should server render to HTML then mount', () => {
  const rootElement = render(h('p', null, 'Hello World!'));
  expect(getByText(rootElement, 'Hello World!').tagName.toLowerCase()).toBe('p');
});
