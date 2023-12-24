import { ExplodeMethod, RollOptions } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/parse";

const { parseExplode } = exportedForTesting;

describe("parseExplode", () => {
  test("ordinary explode", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const rollExpression = "!";
    const result = parseExplode(rollExpression, opts);
    expect(result.explode?.method).toBe(ExplodeMethod.Normal);
    expect(result.explode?.threshold.equalTo).toStrictEqual([20]);
    expect(result.postExplodeExpression).toBe("");
  });

  test("ordinary explode with threshold greater than", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const rollExpression = "!>15";
    const result = parseExplode(rollExpression, opts);
    expect(result.explode?.method).toBe(ExplodeMethod.Normal);
    expect(result.explode?.threshold.aboveEqual).toBe(15);
    expect(result.postExplodeExpression).toBe("");
  });

  test("ordinary explode with threshold equalTo", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const rollExpression = "!15";
    const result = parseExplode(rollExpression, opts);
    expect(result.explode?.method).toBe(ExplodeMethod.Normal);
    expect(result.explode?.threshold.equalTo).toStrictEqual([15]);
    expect(result.postExplodeExpression).toBe("");
  });

  test("penetrating explode", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const rollExpression = "!p";
    const result = parseExplode(rollExpression, opts);
    expect(result.explode?.method).toBe(ExplodeMethod.Penetrating);
    expect(result.explode?.threshold.equalTo).toStrictEqual([20]);
    expect(result.postExplodeExpression).toBe("");
  });

  test("penetrating explode with threshold greater than", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const rollExpression = "!p>15";
    const result = parseExplode(rollExpression, opts);
    expect(result.explode?.method).toBe(ExplodeMethod.Penetrating);
    expect(result.explode?.threshold.aboveEqual).toBe(15);
    expect(result.postExplodeExpression).toBe("");
  });

  test("compounding explode", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const rollExpression = "!!";
    const result = parseExplode(rollExpression, opts);
    expect(result.explode?.method).toBe(ExplodeMethod.Compounding);
    expect(result.explode?.threshold.equalTo).toStrictEqual([20]);
    expect(result.postExplodeExpression).toBe("");
  });

  test("compounding explode with threshold greater than", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const rollExpression = "!!>15";
    const result = parseExplode(rollExpression, opts);
    expect(result.explode?.method).toBe(ExplodeMethod.Compounding);
    expect(result.explode?.threshold.aboveEqual).toBe(15);
    expect(result.postExplodeExpression).toBe("");
  });
});
