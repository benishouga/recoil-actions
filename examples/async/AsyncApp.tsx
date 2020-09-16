import React from 'react';
import { atom, useRecoilValue, RecoilRoot } from 'recoil';
import { connect } from '../../src/recoil-actions';
import { wait } from '../wait';

type State = { count: number; lock: boolean };

const appState = atom<State>({
  key: 'AsyncAppState',
  default: { count: 0, lock: false },
});

const actions = {
  setLock: (state: State, lock: boolean) => {
    return { ...state, lock };
  },
  increment: async (state: State, amount: number) => {
    await wait(); // network delays...
    return { ...state, count: state.count + amount };
  },
};

const useActions = connect(appState).to(actions);

const Button = () => {
  const { lock } = useRecoilValue(appState);
  const { setLock, increment } = useActions();

  return (
    <button
      disabled={lock}
      onClick={async () => {
        setLock(true);
        await increment(1);
        setLock(false);
      }}
    >
      +
    </button>
  );
};

const Display = () => {
  const { count } = useRecoilValue(appState);
  return <>{count}</>;
};

export const AsyncApp = () => (
  <RecoilRoot>
    AsyncApp: <Button /> <Display />
  </RecoilRoot>
);
