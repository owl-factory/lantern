import { RollOptions } from "nodes/rolls/types";
import { exportedForTesting } from "../../../utilities/parse";

const { ensureDefaults } = exportedForTesting;

describe("ensureDefaults", () => {
  test("no defaults present", () => {
    const opts: RollOptions = { size: 20, count: 1 };
    const optsWithDefaults = ensureDefaults(opts);
    expect(optsWithDefaults.criticalSuccess).toBeDefined();
    expect(optsWithDefaults.criticalSuccess?.equalTo).toBeDefined();
    expect(optsWithDefaults.criticalSuccess?.equalTo).toStrictEqual([20]);
  });
});
