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

1. Define `atom`.
   ```ts
   const appState = atom<number>({ key: 'state', default: 0 });
   ```
2. `connect(atom).to(reducers)` to get a function object that can be used as Hooks. 
   ```ts
   const useActions = connect(atom).to({
     increment: (state, amount) => state + amount,
     decrement: (state, amount) => state - amount
   });
   ```
3. コンポートで useActions から Action を取得し使用することで、State の更新を行うことができます。

## Examples

Class-based actions, Async action, Async generator action, abortable request, and Todo App examples.<br>
https://benishouga.github.io/recoil-actions/

## API

### connect - to

```tsx
import { atom } from 'recoil';
import { connect } from 'recoil-actions';

const appState = atom<number>({ key: 'AppState', default: 0 });
const useActions = connect(appState).to({
  increment: (state, amount: number) => state + amount,
});

const SomeComponent = () => {
   const { increment } = useActions();
   return <button onClick={() => increment(1)}>button<button>
};
```

### connectFamily - to

```

```

## Limitation

- Any action in the same context is executed sequentially.
  - When processing in parallel, process them together outside the context or within the context.

## Contributions

I make heavy use of Google Translate. Please tell me if my English is wrong :)

## Lisence

MIT License
