import { RecoilState, useRecoilState } from 'recoil';

type Result<S> = void | S | Promise<void> | Promise<S>;
type GeneratorResult<S> = Generator<Result<S>, Result<S>, S> | AsyncGenerator<Result<S>, Result<S>, S>;
type ImplResult<S> = Result<S> | GeneratorResult<S>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Impl<S, A> = { [P in keyof A]: A[P] extends Function ? (s: S, ...args: any) => ImplResult<S> : any };

type ToExternalParameter<T> = T extends (s: any, ...args: infer P) => any ? P : never;
// eslint-disable-next-line @typescript-eslint/ban-types
type FunctionOnly<T> = Pick<T, { [K in keyof T]: T[K] extends Function ? K : never }[keyof T]>;
type ToExternalFunctoins<S, A> = { [P in keyof A]: (...args: ToExternalParameter<A[P]>) => Promise<S> };
export type Actions<S, A> = ToExternalFunctoins<S, FunctionOnly<A>>;

function isGenerator<S>(obj: any): obj is GeneratorResult<S> {
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

export function connect<S>(
  appState: RecoilState<S>
): {
  to: <A extends Impl<S, A>>(impl: A) => () => Actions<S, A>;
} {
  const queue = new Queue();
  return {
    to: <A extends Impl<S, A>>(impl: A) => {
      return function useActions() {
        const [state, setState] = useRecoilState(appState);
        let _state: S = state;
        const feed = (newState?: S | void) => {
          if (newState !== null && newState !== undefined) {
            _state = newState;
            setState(newState);
          }
        };

        function convert(action: (state: S, ...args: any) => ImplResult<S>) {
          const passToImpl = async (args: any) => {
            const result = await action(_state, ...args);
            if (isGenerator<Result<S>>(result)) {
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
          return (...args: any): Promise<S> =>
            new Promise<S>((resolve, reject) =>
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
          return actions as Actions<S, A>;
        }

        return convertToExternals(impl);
      };
    },
  };
}
