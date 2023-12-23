import { RollOptions } from "nodes/rolls/types";
import { RollArgument } from "nodes/rolls/types/parse";
import { exportedForTesting } from "../../../utilities/parse";

const { determineNextArgument } = exportedForTesting;

describe("determineNextArgument", () => {
  test("no expr present", () => {
    const expr = "";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.None);
  });

  test("critical success", () => {
    const expr = "cs>19";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.CriticalSuccess);
  });

  test("critical failure", () => {
    const expr = "cf<2";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.CriticalFailure);
  });

  test("drop", () => {
    const expr = "dh1";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.Drop);
  });

  test("keep", () => {
    const expr = "kl2";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.Keep);
  });

  test("reroll", () => {
    const expr = "r<2";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.Reroll);
  });

  test("success", () => {
    const expr = ">20";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.Success);
  });

  test("failure", () => {
    const expr = "f<2";
    const arg: RollArgument = determineNextArgument(expr);
    expect(arg).toBe(RollArgument.Failure);
  });
});
