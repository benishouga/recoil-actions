# recoil-actions

![GITHUB-BADGE](https://github.com/benishouga/recoil-actions/workflows/Node.js%20CI/badge.svg)

This library makes it easy to change state when using [Facebook's Recoil](https://github.com/facebookexperimental/Recoil).

## Installation

Requires React 16.8.3 or later.

```
npm install recoil recoil-actions
```

## Concept

This library makes it easy to define `Actions` (It is a Reducers in Redux) to change the State.

- Easy to implement with less code.
- Easy to create async action and async generator actions. (I think it's like rudx-saga.)
- Easy to test. (Only test a stateless implementation.)
- TypeScript friendry. (Strict type checking.)

## Steps to use

1. Define `State`. (Only when using TypeScript.)
   ```ts
   type CounterState = { count: number };
   ```
2. Define `actions` that takes `State` as the first argument and returns `State`.
   ```ts
   const actions = {
     increment: (state: CounterState, amount: number) => ({ ...state, count: state.count + amount }),
   };
   ```
3. `connect(atom).to(actions)` to get a function object that can be used as Hooks.
   ```ts
   const useActions = connect(atom).to(actions);
   ```

## Examples

Class-based actions, Async action, Async generator action, abortable request, and Todo App examples.<br>
https://benishouga.github.io/recoil-actions/

## API

TODO

## Limitation

- Any action in the same context is executed sequentially.
  - When processing in parallel, process them together outside the context or within the context.

## Contributions

I make heavy use of Google Translate. Please tell me if my English is wrong :)

## Lisence

MIT License
