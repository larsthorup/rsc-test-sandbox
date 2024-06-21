# rsc-test-sandbox

An experimental test runner for an experimental implementation of React Server Components. 

The main requirement is that the test runner can manage two global execution contexts, to allow for separate module graphs between server and client rendering.

Non requirements:
- Bundling (using individual URL-based import instead)
- JSX (using `h = createElement` instead)
- TypeScript
- File-system based routing (using client routing instead)

## Getting started

```sh
npm install
npm test
npm start
```

http://localhost:7000/

## TODO

- [ ] useState
- [ ] re-rendering
- [ ] embed react tree in script tag
- [ ] hydrate mounted html with react tree
- [ ] avoid hard-coded paths, like "app" and "lib" in rsc-server
- [ ] e2e-test
- [ ] server actions
- [ ] hydrate react elements returned from server actions
- [ ] generate react-client-manifest.json from `'use client';` with a node module loader hook (simpler than bundling)

## Thanks

- [Aurora Scharff](https://github.com/aurorascharff) for [RSC usage inspiration](https://github.com/aurorascharff/next14-remix-jokes-rebuild).
- [Dan Abramov](https://github.com/gaearon) for [RSC From Scratch](https://github.com/reactwg/server-components/discussions/5)

## Done

- [x] when generating html also expand client components
- [x] when expanding server components skip client components from rsc payload
- [x] bespoke react-client-manifest.json with list of client components
- [x] in test: use worker thread to do server rendering in a different module environment from DOM and client rendering 
- [x] verify that server components are not being loaded in client module environment
- [x] test hydration
- [x] async server components
- [x] render full component tree
- [x] react server
- [x] render static HTML, like `<p>text</p>`
