import { exportedForTesting } from "../../../utilities/parse";

const { parseSize } = exportedForTesting;

describe("parseSize", () => {
  test("success", () => {
    const rollExpression = "20"; // the leading #d should be removed by the preceeding parseCount
    const result = parseSize(rollExpression);
    expect(result.size).toBe(20);
    expect(result.postSizeExpression).toBe("");
  });
});
