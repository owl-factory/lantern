import { __testing__ } from "./node";

jest.mock("lib/mobx");

const { checkIfUsableNode, getNodeName } = __testing__;

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
