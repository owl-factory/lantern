import { parseNodeChildren, getAttributeValue, __testing__ } from "./node";

const { parseNodeChild, checkIfUsableNode, getNodeName } = __testing__;

jest.mock("./registry");

// describe("parseNodeChildren tests", () => {});

// describe("parseNodeChild", () => {});

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
