import React from 'react';
import { atom, useRecoilValue, RecoilRoot } from 'recoil';
import { connect } from '../../src/recoil-actions';

type State = { count: number };

const appState = atom<State>({
  key: 'MinimumAppState',
  default: { count: 0 },
});

const useActions = connect(appState).to({
  increment: (state, amount: number) => ({ ...state, count: state.count + amount }),
});

const Button = () => {
  const { increment } = useActions();
  return <button onClick={() => increment(1)}>+</button>;
};

const Display = () => {
  const { count } = useRecoilValue(appState);
  return <>{count}</>;
};

export const MinimumApp = () => (
  <RecoilRoot>
    MinimumApp: <Button /> <Display />
  </RecoilRoot>
);
