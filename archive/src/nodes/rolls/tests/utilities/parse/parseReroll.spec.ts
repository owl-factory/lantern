import { RollOptions } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/parse";

const { parseReroll } = exportedForTesting;

describe("parseReroll", () => {
  test("invalid length", () => {
    const rollExpression = "r";
    const opts: RollOptions = { size: 20, count: 1};
    expect(() => parseReroll(rollExpression, opts)).toThrowError();
  });

  test("invalid starting character", () => {
    const rollExpression = "k";
    const opts: RollOptions = { size: 20, count: 1};
    expect(() => parseReroll(rollExpression, opts)).toThrowError();
  });

  test("invalid second character", () => {
    const rollExpression = "rb";
    const opts: RollOptions = { size: 20, count: 1};
    expect(() => parseReroll(rollExpression, opts)).toThrowError();
  });

  test("reroll at 2", () => {
    const rollExpression = "r2";
    const opts: RollOptions = { size: 20, count: 1};
    const result = parseReroll(rollExpression, opts);

    expect(result.reroll.once).toBe(false);
    expect(result.reroll.threshold.equalTo).toStrictEqual([2]);
  });

  test("once", () => {
    const rollExpression = "ro2";
    const opts: RollOptions = { size: 20, count: 1};
    const result = parseReroll(rollExpression, opts);

    expect(result.reroll.once).toBe(true);
    expect(result.reroll.threshold.equalTo).toStrictEqual([2]);
  });
});
