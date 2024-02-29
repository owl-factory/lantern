import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { __testing__ } from "./parseLayout";
import { ExpressionType } from "features/dynamicRender/types/expression";

jest.mock("features/dynamicRender/utils/registry");

const {
  checkForExpression,
  getAttributeValue,
  parseAttributes,
  parseAttributeExpression,
  parseNodeChild,
  parseNodeChildren,
} = __testing__;

const getAttribute: (name: string) => string | null = jest.fn((name: string) => name);

const TAG_NAME = "Box";
const INVALID_NODE = { nodeType: Node.COMMENT_NODE } as ChildNode;
const ELEMENT_NODE = {
  nodeType: Node.ELEMENT_NODE,
  tagName: TAG_NAME,
  getAttribute,
  childNodes: [],
} as unknown as Element;
const TEXT_NODE = {
  nodeType: Node.TEXT_NODE,
  textContent: "some text",
} as unknown as Element;

describe("parseNodeChildren tests", () => {
  test("parses nodes successfully", () => {
    const childNodes = [ELEMENT_NODE] as unknown as NodeListOf<ChildNode>;
    const res = parseNodeChildren(childNodes);
    expect(res.length).toBe(1);
  });

  test("parses nodes successfully", () => {
    const childNodes = [INVALID_NODE] as unknown as NodeListOf<ChildNode>;
    const res = parseNodeChildren(childNodes);
    expect(res.length).toBe(0);
  });
});

describe("parseNodeChild", () => {
  let mockCount: Map<string, number>;

  beforeEach(() => {
    jest.mocked(getAttribute).mockClear();
    mockCount = new Map<string, number>();
  });

  test("is not usable node", () => {
    const res = parseNodeChild(INVALID_NODE, mockCount);
    expect(res).toBeUndefined();
  });

  test("has no valid tag name", () => {
    const mockNode = { ...ELEMENT_NODE, tagName: undefined };
    const res = parseNodeChild(mockNode, mockCount);
    expect(res).toBeUndefined();
  });

  test("parses correctly", () => {
    const res = parseNodeChild(ELEMENT_NODE, mockCount);
    expect(res).toBeDefined();
    if (!res) return;
    expect(res.key).toBe(`${TAG_NAME}_1`);
    expect(mockCount.get(TAG_NAME)).toBe(1);
  });
});

describe("parseAttributes tests", () => {
  const ATTRIBUTE_DEFINITIONS: AttributeDefinition[] = [{ name: "test" }];
  it("returns an empty object for an invalid node", () => {
    const attributes = parseAttributes(undefined as unknown as Node, ATTRIBUTE_DEFINITIONS);
    expect(attributes).toStrictEqual({});
  });

  it("is not a valid node type", () => {
    const attributes = parseAttributes(INVALID_NODE, ATTRIBUTE_DEFINITIONS);
    expect(attributes).toStrictEqual({});
  });

  it("is a text node", () => {
    const attributes = parseAttributes(TEXT_NODE, ATTRIBUTE_DEFINITIONS);
    expect(attributes.textContent).toBeDefined();
  });

  it("skips if invalid attribute definitions", () => {
    const attributes = parseAttributes(ELEMENT_NODE, undefined as unknown as AttributeDefinition[]);
    expect(attributes).toStrictEqual({});
  });

  it("inserts an attribute correctly", () => {
    const attributes = parseAttributes(ELEMENT_NODE, ATTRIBUTE_DEFINITIONS);
    expect(attributes[ATTRIBUTE_DEFINITIONS[0].name]).toBeDefined();
  });

  it("skips undefined variables", () => {
    // eslint-disable-next-line no-restricted-syntax
    jest.mocked(getAttribute).mockImplementationOnce(() => null);
    const attributes = parseAttributes(ELEMENT_NODE, ATTRIBUTE_DEFINITIONS);
    expect(attributes).toStrictEqual({});
  });
});

describe("getAttributeValue tests", () => {
  const NAME = "testname";
  const VALUE = "testvalue";
  const DEFAULT = "defaultvalue";

  beforeEach(() => {
    jest.mocked(getAttribute).mockClear();
  });

  it("gets a string value", () => {
    jest.mocked(getAttribute).mockImplementationOnce(() => VALUE);
    const { name, value } = getAttributeValue(ELEMENT_NODE, { name: NAME });
    expect(name).toBe(NAME);
    expect(value).toBe(VALUE);
  });

  it("is default value if not found", () => {
    // eslint-disable-next-line no-restricted-syntax
    jest.mocked(getAttribute).mockImplementationOnce(() => null);

    const { name, value } = getAttributeValue(ELEMENT_NODE, { name: NAME, default: DEFAULT });
    expect(name).toBe(NAME);
    expect(value).toBe(DEFAULT);
  });

  it("is evaluated as expression", () => {
    jest.mocked(getAttribute).mockImplementationOnce(() => VALUE);
    const { name, value } = getAttributeValue(ELEMENT_NODE, {
      name: NAME,
      supportsExpressions: true,
    });
    expect(name).toBe(NAME);
    expect(typeof value).toBe("object");
  });
});

describe("parseAttributeExpression tests", () => {
  it("given text is not a string", () => {
    const expression = parseAttributeExpression(undefined as unknown as string);
    expect(expression.type).toBe(ExpressionType.Invalid);
  });

  it("does not have an expression", () => {
    const expression = parseAttributeExpression("no expressions here");
    expect(expression.type).toBe(ExpressionType.PlainText);
  });
});

describe("checkForExpression tests", () => {
  it("returns false on non-string", () => {
    const result = checkForExpression(undefined as unknown as string);
    expect(result).toBe(false);
  });

  it("starts with an expression", () => {
    const result = checkForExpression("${self.name}");
    expect(result).toBe(true);
  });

  it("contains an expression", () => {
    const result = checkForExpression("Hi, my name is ${self.name}");
    expect(result).toBe(true);
  });

  it("has an escaped expression", () => {
    const result = checkForExpression("Hi, my name is \\${self.name}");
    expect(result).toBe(false);
  });

  it("has no expression", () => {
    const result = checkForExpression("I'm afraid you are... expressionless");
    expect(result).toBe(false);
  });
});
