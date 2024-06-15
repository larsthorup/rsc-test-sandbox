import { expect, it } from "vitest";
import { getByText } from "@testing-library/dom";
import { createElement as h } from "../lib/react.js";
import { render } from "../lib/rsc-test.js";
import RootPage from "./index.js";

it('should server render to HTML then mount', async () => {
  const rootElement = await render(h(RootPage));
  expect(getByText(rootElement, 'Dreams').tagName.toLowerCase()).toBe('span');
});
