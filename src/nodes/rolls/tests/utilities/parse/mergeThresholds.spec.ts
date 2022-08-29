import { RollThreshold } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/parse";

const { mergeThresholds } = exportedForTesting;

describe("mergeThresholds", () => {
  test("merge equals", () => {
    const originalThreshold: RollThreshold = { equalTo: [20] };
    const newThreshold: RollThreshold = { equalTo: [19] };
    const result = mergeThresholds(originalThreshold, newThreshold);
    expect(result.equalTo).toStrictEqual([19, 20]);
  });

  test("merge below equal", () => {
    const originalThreshold: RollThreshold = { belowEqual: 1 };
    const newThreshold: RollThreshold = { belowEqual: 2 };
    const result = mergeThresholds(originalThreshold, newThreshold);
    expect(result.belowEqual).toBe(2);
  });

  test("merge above equal", () => {
    const originalThreshold: RollThreshold = { aboveEqual: 20 };
    const newThreshold: RollThreshold = { aboveEqual: 18 };
    const result = mergeThresholds(originalThreshold, newThreshold);
    expect(result.aboveEqual).toBe(18);
  });
});
