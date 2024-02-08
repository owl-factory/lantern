import { PromiseReference } from "features/webWorker/types/promises";

const mockPromiseReference: PromiseReference<string, undefined, undefined> = {
  id: "5fa7f923-85a0-4dc9-9c85-18ea2366ed93",
  type: "type",
  timeout: 15 as unknown as NodeJS.Timeout,
  data: undefined,
  resolve: jest.fn(),
  reject: jest.fn(),
  promise: new Promise(() => {}),
};

export const buildWorkerPromise = jest.fn(() => mockPromiseReference);
