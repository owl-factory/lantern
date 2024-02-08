import crypto from "crypto";

Object.defineProperty(global, "crypto", {
  value: {
    randomUUID: () => "5fa7f923-85a0-4dc9-9c85-18ea2366ed93",
    getRandomValues: (arr: unknown[]) => crypto.randomBytes(arr.length),
  },
});

Object.defineProperty(global, "URL", {
  value: {
    createObjectURL: jest.fn(() => ""),
  },
});

Object.defineProperty(global, "Worker", {
  value: jest.fn(() => ({
    postMessage: jest.fn(),
  })),
});
