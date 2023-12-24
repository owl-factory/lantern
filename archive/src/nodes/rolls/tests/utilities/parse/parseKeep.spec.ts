import { RollOptions } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/parse";

const { parseKeep } = exportedForTesting;

describe("parseKeep", () => {
  test("invalid length", () => {
    const rollExpression = "k";
    const opts: RollOptions = { size: 20, count: 1};
    expect(() => parseKeep(rollExpression, opts)).toThrowError();
  });

  test("invalid starting character", () => {
    const rollExpression = "d1";
    const opts: RollOptions = { size: 20, count: 1};
    expect(() => parseKeep(rollExpression, opts)).toThrowError();
  });

  test("keep highest(default arg)", () => {
    const rollExpression = "k2";
    const opts: RollOptions = { size: 20, count: 1};
    const result = parseKeep(rollExpression, opts);

    expect(result.keep.highest).toBe(2);
  });

  test("keep highest (explicit)", () => {
    const rollExpression = "kh2";
    const opts: RollOptions = { size: 20, count: 1};
    const result = parseKeep(rollExpression, opts);

    expect(result.keep.highest).toBe(2);
  });

  test("keep lowest", () => {
    const rollExpression = "kl2";
    const opts: RollOptions = { size: 20, count: 1};
    const result = parseKeep(rollExpression, opts);

    expect(result.keep.lowest).toBe(2);
  });

  test("invalid - keep both highest and lowest", () => {
    const rollExpression = "kh2";
    const opts: RollOptions = { size: 20, count: 1, keep: { lowest: 1 }};
    expect(() => parseKeep(rollExpression, opts)).toThrowError();
  });
});
