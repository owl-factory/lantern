import { ExplodeMethod, RollOptions, RollThreshold } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/roll";

const { doesTriggerExplode } = exportedForTesting;

describe("doesTriggerExplode", () => {
  test("no explode", () => {
    const value = 5;
    const opts: RollOptions = {
      size: 20, count: 1, reroll: undefined,
    };
    const result = doesTriggerExplode(value,  opts);
    expect(result).toBeFalsy();
  });

  test("explode!", () => {
    const value = 5;
    const opts: RollOptions = {
      size: 20, count: 1, explode: { threshold: { equalTo: [5] }, method: ExplodeMethod.Normal },
    };
    const result = doesTriggerExplode(value, opts);
    expect(result).toBeTruthy();
  });
});
