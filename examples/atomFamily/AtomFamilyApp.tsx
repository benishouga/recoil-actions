import React from 'react';
import { useRecoilValue, RecoilRoot, atomFamily } from 'recoil';
import { connectFamily } from '../../src/recoil-actions';

type State = { count: number };

const appStateFamily = atomFamily<State, number>({
  key: 'AtomFamilyAppState',
  default: { count: 0 },
});

const useActions = connectFamily(appStateFamily).to({
  increment: (state, amount: number) => ({ ...state, count: state.count + amount }),
});

const Button = ({ id }: { id: number }) => {
  const { increment } = useActions(id);
  return <button onClick={() => increment(1)}>+</button>;
};

const Display = ({ id }: { id: number }) => {
  const { count } = useRecoilValue(appStateFamily(id));
  return <>{count}</>;
};

export const AtomFamilyApp = () => (
  <RecoilRoot>
    AtomFamilyApp: id 1 <Button id={1} /> <Display id={1} />, id 2 <Button id={2} /> <Display id={2} />
  </RecoilRoot>
);
