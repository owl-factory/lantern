export const isValidRef = jest.fn((ref: unknown) => {
  return true;
});

export const isValidCollection = jest.fn((_ref: unknown, _expectedCollection?: string) => true);
export const getUpdatedAt = jest.fn();
