export const wait = ({ signal }: { signal?: AbortSignal } = {}) =>
  new Promise((resolve, reject) => {
    const id = setTimeout(resolve, 500);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(id);
        reject('aborted');
      });
    }
  });
