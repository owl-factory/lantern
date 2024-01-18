import { __testing__ } from "./expression";

const { extractExpressionComponents } = __testing__;

describe("extractExpressionComponent tests", () => {
  test("programming", () => {
    const expression = "character.name + character['level'+index]";
    const components = extractExpressionComponents(expression);
    console.log(components);
  });
});
