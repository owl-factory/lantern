import { getVariableComponents } from "utils/data";

describe("getVariableComponents", () => {
  it("is in development", () => {
    const res = getVariableComponents("self['abc']");
  });
});
