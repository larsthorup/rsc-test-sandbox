# rsc-test-sandbox

An experimental test runner for an experimental implementation of React Server Components. 

The main requirement is that the test runner can manage two global execution contexts, to allow for separate module graphs between server and client rendering.

## TODO

- [ ] JSX via TypeScript
- [ ] hydration
- [ ] async server components
- [ ] client components
- [ ] server actions

## Done

- [x] render static HTML, like `<p>text</p>`
