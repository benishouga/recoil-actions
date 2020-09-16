import '@testing-library/jest-dom';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { connect } from './recoil-actions';
import { atom, useRecoilValue, RecoilRoot } from 'recoil';

const wait10 = async () => new Promise((resolve) => setTimeout(resolve, 10));

describe('recoil-actions', () => {
  describe('simple actions', () => {
    type State = { count: number };
    const appState = atom<State>({
      key: 'simple actions',
      default: { count: 0 },
    });
    const useActions = connect(appState).to({
      increment: (state, amount: number) => ({ count: state.count + amount }),
      doNothing: () => {},
    });
    const DoNothingButton = () => {
      const { doNothing } = useActions();
      return <button onClick={() => doNothing()}>button</button>;
    };
    const IncrementButton = () => {
      const { increment } = useActions();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const TwiceButton = () => {
      const { increment } = useActions();

      return (
        <button
          onClick={() => {
            void increment(1);
            void increment(1);
          }}
        >
          button
        </button>
      );
    };
    const Display = () => {
      const { count } = useRecoilValue(appState);
      return <>count is {count}</>;
    };

    test('connect-to method can create a useActions instance.', () => {
      const useActions = connect(
        atom<Record<string, unknown>>({
          key: 'connect-to method can create a useActions instance.',
          default: {},
        })
      ).to({});
      expect(useActions).toBeDefined();
    });

    test('Update the State using an action.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <IncrementButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 1')).toBeDefined();
    });

    test('Action is executed sequentially when double-clicked.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <IncrementButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 2')).toBeDefined();
    });

    test('Action is executed sequentially when the action is called twice on the same event loop.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <TwiceButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 2')).toBeDefined();
    });

    test('Action is not updated if it does not return a value.', async () => {
      const { getByText } = render(
        <RecoilRoot>
          <DoNothingButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      await wait10();
      expect(getByText('count is 0')).toBeInTheDocument();
    });
  });

  describe('class based actions', () => {
    type State = { count: number };
    const appState = atom<State>({
      key: 'class based actions',
      default: { count: 0 },
    });
    class Actions {
      increment(state: State, amount: number) {
        return { count: state.count + amount };
      }
    }
    const useActions = connect(appState).to(new Actions());
    const IncrementButton = () => {
      const { increment } = useActions();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const Display = () => {
      const { count } = useRecoilValue(appState);
      return <>count is {count}</>;
    };

    test('Actions work even if made based on Class.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <IncrementButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 1')).toBeDefined();
    });
  });

  describe('async actions', () => {
    type State = { count: number };
    const appState = atom<State>({
      key: 'async actions',
      default: { count: 0 },
    });
    const useActions = connect(appState).to({
      increment: async (state, amount: number) => {
        await wait10(); // wait for event loop
        return { count: state.count + amount };
      },
    });
    const IncrementButton = () => {
      const { increment } = useActions();
      return <button onClick={() => increment(1)}>button</button>;
    };
    const Display = () => {
      const { count } = useRecoilValue(appState);
      return <>count is {count}</>;
    };

    test('Async action works.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <IncrementButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 1')).toBeDefined();
    });

    test('Async action is executed sequentially.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <IncrementButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 2')).toBeDefined();
    });
  });

  describe('generator actions', () => {
    type State = { count: number };
    const appState = atom<State>({
      key: 'generator actions',
      default: { count: 0 },
    });
    const useActions = connect(appState).to({
      async *iiincrement(state: State, amount: number) {
        await wait10();
        state = yield { ...state, count: state.count + amount };
        await wait10();
        state = yield { ...state, count: state.count + amount };
        await wait10();
        return { ...state, count: state.count + amount };
      },
    });
    const IncrementButton = () => {
      const { iiincrement } = useActions();
      return <button onClick={() => iiincrement(1)}>button</button>;
    };
    const Display = () => {
      const { count } = useRecoilValue(appState);
      return <>count is {count}</>;
    };

    test('Generator action works.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <IncrementButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 1')).toBeDefined();
      expect(await findByText('count is 2')).toBeDefined();
      expect(await findByText('count is 3')).toBeDefined();
    });

    test('Generator action is executed sequentially.', async () => {
      const { getByText, findByText } = render(
        <RecoilRoot>
          <IncrementButton />
          <Display />
        </RecoilRoot>
      );
      expect(getByText('count is 0')).toBeInTheDocument();
      fireEvent.click(getByText('button'));
      fireEvent.click(getByText('button'));
      expect(await findByText('count is 1')).toBeDefined();
      expect(await findByText('count is 2')).toBeDefined();
      expect(await findByText('count is 3')).toBeDefined();
      expect(await findByText('count is 4')).toBeDefined();
      expect(await findByText('count is 5')).toBeDefined();
      expect(await findByText('count is 6')).toBeDefined();
    });
  });
});
