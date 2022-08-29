import { exportedForTesting } from "../../../utilities/parse";

const { parseCount } = exportedForTesting;

describe("parseCount", () => {
  test("success", () => {
    const rollExpression = "1d20";
    const result = parseCount(rollExpression);
    expect(result.count).toBe(1);
    expect(result.postCountExpression).toBe("20");
  });
});
