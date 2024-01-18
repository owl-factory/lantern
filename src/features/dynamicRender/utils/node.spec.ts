import { getAttributeValue, __testing__ } from "./node";

jest.mock("lib/mobx");

const { checkIfUsableNode, getNodeName } = __testing__;

const getAttribute: (name: string) => string = jest.fn((name: string) => name);

const INVALID_NODE = { nodeType: Node.COMMENT_NODE } as ChildNode;

describe("checkIfUsableNode tests", () => {
  test("valid text node", () => {
    const mockNode = { nodeType: Node.TEXT_NODE, textContent: "Hello world!" } as ChildNode;
    const res = checkIfUsableNode(mockNode);
    expect(res).toBe(true);
  });

  test("empty text node", () => {
    const mockNode = { nodeType: Node.TEXT_NODE, textContent: "    " } as ChildNode;
    const res = checkIfUsableNode(mockNode);
    expect(res).toBe(false);
  });

  test("element node", () => {
    const mockNode = { nodeType: Node.ELEMENT_NODE } as ChildNode;
    const res = checkIfUsableNode(mockNode);
    expect(res).toBe(true);
  });

  test("other node", () => {
    const res = checkIfUsableNode(INVALID_NODE);
    expect(res).toBe(false);
  });
});

describe("getNodeName tests", () => {
  test("is text node", () => {
    const mockNode = { nodeType: Node.TEXT_NODE } as ChildNode;
    const res = getNodeName(mockNode);
    expect(res).toBe("#text");
  });

  test("is element", () => {
    const mockNode = { nodeType: Node.ELEMENT_NODE, tagName: "Box" } as Element;
    const res = getNodeName(mockNode);
    expect(res).toBe(mockNode.tagName);
  });

  test("matches nothing", () => {
    const mockNode = { nodeType: Node.COMMENT_NODE } as ChildNode;
    const res = getNodeName(mockNode);
    expect(res).toBeUndefined();
  });
});

describe("getAttributeValue", () => {
  const mockAttribute = "mockAttr";
  const mockDefaultValue = "good, anakin, good";

  beforeEach(() => {
    jest.mocked(getAttribute).mockClear();
  });

  test("not an element node", () => {
    const res = getAttributeValue(INVALID_NODE, mockAttribute, mockDefaultValue);
    expect(res).toBe(mockDefaultValue);
  });

  test("missing attribute", () => {
    // This `null` is required because we are mocking the built-in Element.getAttribute() function,
    // which returns null when an attribute is not found.
    // eslint-disable-next-line no-restricted-syntax
    jest.mocked(getAttribute).mockImplementationOnce(() => null);
    const mockNode = { nodeType: Node.ELEMENT_NODE, getAttribute } as Element;

    const res = getAttributeValue(mockNode, mockAttribute, mockDefaultValue);

    expect(getAttribute).toHaveBeenCalled();
    expect(res).toBe(mockDefaultValue);
  });

  test("successful find", () => {
    const mockNode = { nodeType: Node.ELEMENT_NODE, getAttribute } as Element;

    const res = getAttributeValue(mockNode, mockAttribute, mockDefaultValue);

    expect(getAttribute).toHaveBeenCalled();
    expect(res).toBe(mockAttribute);
  });
});
