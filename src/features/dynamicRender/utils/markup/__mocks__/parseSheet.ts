import { Ok } from "utils/results";

export const parseMarkup = jest.fn(() => Ok({ layout: {}, variables: {}, prefabs: {} }));
export const findFirstElementByTag = jest.fn(() => undefined);
