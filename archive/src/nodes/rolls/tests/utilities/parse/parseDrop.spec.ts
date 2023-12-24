import { exportedForTesting } from "../../../utilities/parse";

const { parseDrop } = exportedForTesting;

describe("parseCount", () => {
  test("drop lowest, shortcut", () => {
    const rollExpression = "d1";
    const opts = { count: 2, size: 20 };
    const result = parseDrop(rollExpression, opts);
    expect(result.drop.lowest).toBeDefined();
    expect(result.drop.lowest).toBe(1);
    expect(result.postDropExpression).toBe("");
  });

  test("drop lowest, no shortcut", () => {
    const rollExpression = "dl1";
    const opts = { count: 2, size: 20 };
    const result = parseDrop(rollExpression, opts);
    expect(result.drop.lowest).toBeDefined();
    expect(result.drop.lowest).toBe(1);
    expect(result.postDropExpression).toBe("");
  });

  test("drop highest, no shortcut", () => {
    const rollExpression = "dh1";
    const opts = { count: 2, size: 20 };
    const result = parseDrop(rollExpression, opts);
    expect(result.drop.highest).toBeDefined();
    expect(result.drop.highest).toBe(1);
    expect(result.postDropExpression).toBe("");
  });
});
