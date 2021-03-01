export const debounce = <F extends (...args: any) => any>(
  func: F,
  waitFor: number,
) => {
  let timeout: any;

  const debounced = (...args: any) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
};

export const randomNumber = (floor: number, ceil: number) =>
  Math.ceil(Math.random() * (ceil - floor) + floor);

export const arrayOfType = (data: unknown[] | null | undefined, Type: any) =>
  data?.length ? data.map(item => new Type(item)) : [];
