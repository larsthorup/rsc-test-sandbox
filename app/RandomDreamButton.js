// 'use client';
import { createElement as h } from "../lib/react.js";

// import { useNavigate as useNavigatePage } from '../router/PageRouter';

export default function RandomDreamButton() {
  // const navigatePage = useNavigatePage();
  function onClick() {
    // navigatePage('all');
  }

  return h(
    "button",
    { onClick, className: "client-component" },
    "See random dream"
  );
}
