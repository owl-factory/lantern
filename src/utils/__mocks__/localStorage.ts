import { Err, Ok } from "utils/results";

export const getLocalStorage = jest.fn((key: string, type: string) => {
  switch (type) {
    case "string":
      return Ok(key);
    case "boolean":
      return Ok(key === "true");
    case "number":
      return Ok(+key);
    case "object":
      return Ok({ key });
  }
  return Err(key);
});

export const setLocalStorage = jest.fn();
export const removeLocalStorage = jest.fn();
