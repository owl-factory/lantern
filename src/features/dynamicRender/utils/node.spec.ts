import { parseNodeChildren, getAttributeValue, __testing__ } from "./node";

const { parseNodeChild, checkIfUsableNode, getNodeName } = __testing__;

jest.mock("./registry");

const getAttribute: (name: string) => string = jest.fn((name: string) => name);

const tagName = "Box";
const INVALID_NODE = { nodeType: Node.COMMENT_NODE } as ChildNode;
const ELEMENT_NODE = { nodeType: Node.ELEMENT_NODE, tagName, getAttribute } as Element;

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
    expect(res.key).toBe(`${tagName}_1`);
    expect(mockCount.get(tagName)).toBe(1);
  });
});

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
    expect(res).toBe("text");
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
    // TODO Can we change this to not be null, or should we keep the disable?
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
