import React from 'react';
import { atom, useRecoilValue, RecoilRoot } from 'recoil';
import { connect } from '../../src/recoil-actions';

type State = { count: number };

class Actions {
  increment(state: State, amount: number) {
    return { ...state, count: state.count + amount };
  }
}

const appState = atom<State>({
  key: 'ClassBasedAppState',
  default: { count: 0 },
});

const useActions = connect(appState).to(new Actions());

const Button = () => {
  const { increment } = useActions();
  return <button onClick={() => increment(1)}>+</button>;
};

const Display = () => {
  const { count } = useRecoilValue(appState);
  return <>{count}</>;
};

export const ClassBasedApp = () => (
  <RecoilRoot>
    ClassBasedApp: <Button /> <Display />
  </RecoilRoot>
);
