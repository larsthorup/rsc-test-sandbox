import { createElement as h } from "../lib/react.js";
import DreamList from "./DreamList.js";

export default async function refreshDreamList() {
  'use server';
  return h(DreamList);
}
