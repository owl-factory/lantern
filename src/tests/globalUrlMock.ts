Object.defineProperty(global, "URL", {
  value: {
    createObjectURL: jest.fn(() => ""),
  },
});
