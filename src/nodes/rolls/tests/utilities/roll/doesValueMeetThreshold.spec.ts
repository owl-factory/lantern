import { ExplodeMethod, RollOptions, RollThreshold } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/roll";

const { doesValueMeetThreshold } = exportedForTesting;

describe("doesValueMeetThreshold", () => {
  test("empty threshold", () => {
    const value = 5;
    const threshold: RollThreshold = {};
    const result = doesValueMeetThreshold(value, threshold);
    expect(result).toBeFalsy();
  });

  test("equalTo", () => {
    const value = 5;
    const threshold: RollThreshold = { equalTo: [5] };
    const result = doesValueMeetThreshold(value, threshold);
    expect(result).toBeTruthy();
  });

  test("aboveEqual success", () => {
    const value = 5;
    const threshold: RollThreshold = { aboveEqual: 5 };
    const result = doesValueMeetThreshold(value, threshold);
    expect(result).toBeTruthy();
  });

  test("aboveEqual fail", () => {
    const value = 4;
    const threshold: RollThreshold = { aboveEqual: 5 };
    const result = doesValueMeetThreshold(value, threshold);
    expect(result).toBeFalsy();
  });
});
