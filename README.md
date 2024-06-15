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

- [ ] render full component tree
- [ ] hydration
- [ ] client components
- [ ] e2e-test
- [ ] async server components
- [ ] server actions

## Done

- [x] react server
- [x] render static HTML, like `<p>text</p>`
