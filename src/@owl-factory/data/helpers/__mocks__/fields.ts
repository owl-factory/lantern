export const isValidRef = jest.fn((ref: unknown) => {
  if (typeof ref !== "string" || ref === "") { return false; }
  return true;
});

export const isValidCollection = jest.fn();
export const getUpdatedAt = jest.fn();
