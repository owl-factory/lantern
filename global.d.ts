type FilterMapCallback<T, U> = (value: T, index: number, array: T[]) => U | undefined;

interface Array<T> {
  filterMap: <U = T>(callbackFn: FilterMapCallback<T, U>) => U[];
  test: () => void;
}
