import { ExplodeMethod, RollOptions, RollThreshold } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/roll";

const { doesTriggerReroll } = exportedForTesting;

describe("doesTriggerReroll", () => {
  test("empty threshold", () => {
    const value = 5;
    const rerollCount = 0;
    const opts: RollOptions = {
      size: 20, count: 1, reroll: undefined,
    };
    const result = doesTriggerReroll(value, rerollCount, opts);
    expect(result).toBeFalsy();
  });

  test("does trigger", () => {
    const value = 5;
    const rerollCount = 0;
    const opts: RollOptions = {
      size: 20, count: 1, reroll: { threshold: { equalTo: [5] }, once: false },
    };
    const result = doesTriggerReroll(value, rerollCount, opts);
    expect(result).toBeTruthy();
  });

  test("does trigger once success", () => {
    const value = 5;
    const rerollCount = 0;
    const opts: RollOptions = {
      size: 20, count: 1, reroll: { threshold: { equalTo: [5] }, once: true },
    };
    const result = doesTriggerReroll(value, rerollCount, opts);
    expect(result).toBeTruthy();
  });

  test("does trigger once fail", () => {
    const value = 5;
    const rerollCount = 1;
    const opts: RollOptions = {
      size: 20, count: 1, reroll: { threshold: { equalTo: [5] }, once: true },
    };
    const result = doesTriggerReroll(value, rerollCount, opts);
    expect(result).toBeFalsy();
  });
});
