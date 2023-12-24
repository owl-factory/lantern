import { exportedForTesting } from "../../../utilities/parse";

const { parseThreshold } = exportedForTesting;

describe("parseThreshold", () => {
  test("empty", () => {
    const rollExpression = "";
    const result = parseThreshold(rollExpression);
    expect(result.threshold).toBeUndefined();
    expect(result.postThresholdExpression).toBe("");
  });

  test("equalTo", () => {
    const rollExpression = "5";
    const result = parseThreshold(rollExpression);
    expect(result.threshold?.equalTo).toStrictEqual([5]);
    expect(result.postThresholdExpression).toBe("");
  });

  test("greater than equals value", () => {
    const rollExpression = ">5";
    const result = parseThreshold(rollExpression);
    expect(result.threshold?.aboveEqual).toBe(5);
    expect(result.postThresholdExpression).toBe("");
  });

  test("greater than value", () => {
    const rollExpression = ">>5";
    const result = parseThreshold(rollExpression);
    expect(result.threshold?.above).toBe(5);
    expect(result.postThresholdExpression).toBe("");
  });

  test("less than equals value", () => {
    const rollExpression = "<5";
    const result = parseThreshold(rollExpression);
    expect(result.threshold?.belowEqual).toBe(5);
    expect(result.postThresholdExpression).toBe("");
  });

  test("less than value", () => {
    const rollExpression = "<<5";
    const result = parseThreshold(rollExpression);
    expect(result.threshold?.below).toBe(5);
    expect(result.postThresholdExpression).toBe("");
  });

  test("greater than equals value", () => {
    const rollExpression = ">5";
    const result = parseThreshold(rollExpression);
    expect(result.threshold?.aboveEqual).toBe(5);
    expect(result.postThresholdExpression).toBe("");
  });

  test("not a number", () => {
    const rollExpression = "<b";
    expect(() => parseThreshold(rollExpression))
    .toThrowError();
  });
});
