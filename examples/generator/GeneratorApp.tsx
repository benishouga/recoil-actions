import React from 'react';
import { wait } from '../wait';
import { connect } from '../../src/recoil-actions';
import { atom, useRecoilValue, RecoilRoot } from 'recoil';

type State = { count: number; lock: boolean };

class Actions {
  setLock(state: State, lock: boolean) {
    return { ...state, lock };
  }
  async *increment(state: State, amount: number) {
    state = yield this.setLock(state, true);

    await wait(); // network delays...
    state = yield { ...state, count: state.count + amount };

    return this.setLock(state, false);
  }
}

const appState = atom<State>({
  key: 'GeneratorAppState',
  default: { count: 0, lock: false },
});

const useActions = connect(appState).to(new Actions());

const Button = () => {
  const { lock } = useRecoilValue(appState);
  const { increment } = useActions();

  return (
    <button disabled={lock} onClick={() => increment(1)}>
      +
    </button>
  );
};

const Display = () => {
  const { count } = useRecoilValue(appState);
  return <>{count}</>;
};

export const GeneratorApp = () => (
  <RecoilRoot>
    GeneratorApp: <Button /> <Display />
  </RecoilRoot>
);
