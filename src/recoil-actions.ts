import { RecoilState, useRecoilState } from 'recoil';

type Result<T> = void | T | Promise<void> | Promise<T>;
type GeneratorResult<T> = Generator<Result<T>, Result<T>, T> | AsyncGenerator<Result<T>, Result<T>, T>;
type ImplResult<T> = Result<T> | GeneratorResult<T>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Impl<T, A> = { [P in keyof A]: A[P] extends Function ? (s: T, ...args: any) => ImplResult<T> : any };

type ToExternalParameter<T> = T extends (s: any, ...args: infer P) => any ? P : never;
// eslint-disable-next-line @typescript-eslint/ban-types
type FunctionOnly<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>;
type ToExternalFunctoins<T, A> = { [P in keyof A]: (...args: ToExternalParameter<A[P]>) => Promise<T> };
export type Actions<T, A> = ToExternalFunctoins<T, FunctionOnly<A>>;

function isGenerator<T>(obj: any): obj is GeneratorResult<T> {
  return obj && typeof obj.next === 'function' && typeof obj.throw === 'function' && typeof obj.return === 'function';
}

let ignores: string[] = [];
const extract = (obj: Record<string, unknown>) => {
  let t = obj;
  const set = new Set<string>();
  while (t) {
    Object.getOwnPropertyNames(t)
      .filter((n) => typeof (t as any)[n] === 'function' && !ignores.includes(n))
      .forEach((n) => set.add(n));
    t = Object.getPrototypeOf(t);
  }
  return Array.from(set);
};
ignores = extract({});

type Task = () => Promise<void>;
class Queue {
  private q: Task[] = [];

  push(task: Task) {
    const free = !this.q.length;
    this.q.push(task);
    if (free) this.awake();
  }

  awake() {
    this.q[0]?.().finally(() => {
      this.q.shift();
      this.awake();
    });
  }
}

function _<T, A extends Impl<T, A>>(impl: A, queue: Queue, atomState: RecoilState<T>) {
  const [state, setState] = useRecoilState(atomState);
  let _state: T = state;
  const feed = (newState?: T | void) => {
    if (newState !== null && newState !== undefined) {
      _state = newState;
      setState(newState);
    }
  };

  function convert(action: (state: T, ...args: any) => ImplResult<T>) {
    const passToImpl = async (args: any) => {
      const result = await action(_state, ...args);
      if (isGenerator<Result<T>>(result)) {
        let more = true;
        while (more) {
          const next = await result.next(_state);
          feed(await next.value);
          more = !next.done;
        }
      } else {
        feed(result);
      }
    };
    return (...args: any): Promise<T> =>
      new Promise<T>((resolve, reject) =>
        queue.push(async () => {
          await passToImpl(args)
            .then(() => resolve(_state))
            .catch(reject);
        })
      );
  }

  function convertToExternals(impl: A) {
    const actions: any = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    extract(impl).forEach((name) => (actions[name] = convert((impl as any)[name].bind(impl))));
    return actions as Actions<T, A>;
  }

  return convertToExternals(impl);
}

export function connectFamily<T, P>(
  appStateFamily: (param: P) => RecoilState<T>
): { to: <A extends Impl<T, A>>(impl: A) => (param: P) => Actions<T, A> } {
  const queue = new Queue();
  return {
    to: <A extends Impl<T, A>>(impl: A) => {
      return function useActions(param: P) {
        return _(impl, queue, appStateFamily(param));
      };
    },
  };
}

export function connect<T>(appState: RecoilState<T>): { to: <A extends Impl<T, A>>(impl: A) => () => Actions<T, A> } {
  const queue = new Queue();
  return {
    to: <A extends Impl<T, A>>(impl: A) => {
      return function useActions() {
        return _(impl, queue, appState);
      };
    },
  };
}
