import { __testing__ } from "features/dynamicRender/hooks/useExpression";
import { ExpressionType, PlainTextExpression } from "features/dynamicRender/types/expression";

const { getInitialValue } = __testing__;

describe("get initial value tests", () => {
  it("returns a string without changing it", () => {
    const testStr = "test";
    const res = getInitialValue(testStr);
    expect(res).toBe(testStr);
  });

  it("handles invalid types safely", () => {
    const res = getInitialValue(1234 as unknown as string);
    expect(res).toBe("");
  });

  it("returns plaintext expressions", () => {
    const plainTextExpression: PlainTextExpression = {
      type: ExpressionType.PlainText,
      value: "test",
    };

    const res = getInitialValue(plainTextExpression);
    expect(res).toBe(plainTextExpression.value);
  });
});
