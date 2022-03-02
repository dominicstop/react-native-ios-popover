
/** wrapper func for setState that returns a promise */
// eslint-disable-next-line consistent-this
export function setStateAsync<T>(
  that: React.Component,
  newState: T | ((prevState: T) => T)
){
  return new Promise<void>((resolve) => {
    that.setState(newState, () => {
      resolve();
    });
  });
};

/** wrapper for timeout that returns a promise */
export function timeout(ms: Number) {
  return new Promise<void>(resolve => {
    const timeoutID = setTimeout(() => {
      clearTimeout(timeoutID);
      resolve();
    }, ms)
  });
};

export function isObject(value: unknown): value is object {
  return (typeof value === 'object' && value !== null);
};