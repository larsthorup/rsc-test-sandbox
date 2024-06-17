import { expect, it } from "vitest";
import { findByText, getByText, queryByText } from "@testing-library/dom";
import { createElement as h } from "../lib/react.js";
import { render } from "../lib/rsc-test.js";
import RootPage from "./index.js";
import { userEvent } from "@testing-library/user-event";

it('should server render to HTML then mount', async () => {
  const user = userEvent.setup();

  // when: page is initially rendered
  const rootElement = await render(h(RootPage));

  // then: outline is expanded and all children are rendered 
  const outlineToggle = getByText(rootElement, 'Here are a few more dreams to check out: ▼');
  expect(outlineToggle.tagName.toLowerCase()).toBe('p');
  expect(getByText(rootElement, 'Compose').tagName.toLowerCase()).toBe('span');

  // when: outline is toggled
  await user.click(outlineToggle);

  // then: outline is collapsed and no children are rendered 
  await findByText(rootElement, 'Here are a few more dreams to check out: ▶');
  expect(queryByText(rootElement, 'Compose')).toBeNull();
});
