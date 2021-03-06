
//wrapper func for setState that returns a promise
export function setStateAsync(that, newState) {
  return new Promise((resolve) => {
    that.setState(newState, () => {
      resolve();
    });
  });
};

//wrapper for timeout that returns a promise
export function timeout(ms) {
  return new Promise(resolve => {
    const timeoutID = setTimeout(() => {
      clearTimeout(timeoutID);
      resolve();
    }, ms)
  });
};

export function isObject(value){
  return (typeof value === 'object' && value !== null);
};