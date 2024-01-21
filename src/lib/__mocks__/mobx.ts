import { Ok } from "utils/results";

export const action = {};
export const computed = {};
export const observable = {};
export const observer = jest.fn((x) => x);
export const safeMakeObservable = jest.fn(() => Ok({}));
