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

- [ ] hydration
- [ ] client components
- [ ] e2e-test
- [ ] server actions
- [ ] hydrate react elements returned from server actions

## Thanks

- [Aurora Scharff](https://github.com/aurorascharff) for [RSC usage inspiration](https://github.com/aurorascharff/next14-remix-jokes-rebuild).
- [Dan Abramov](https://github.com/gaearon) for [RSC From Scratch](https://github.com/reactwg/server-components/discussions/5)

## Done

- [x] async server components
- [x] render full component tree
- [x] react server
- [x] render static HTML, like `<p>text</p>`
