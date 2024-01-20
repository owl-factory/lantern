import { __testing__ } from "./parseLayout";

jest.mock("features/dynamicRender/utils/registry");

const { parseNodeChild, parseNodeChildren } = __testing__;

const getAttribute: (name: string) => string = jest.fn((name: string) => name);

const TAG_NAME = "Box";
const INVALID_NODE = { nodeType: Node.COMMENT_NODE } as ChildNode;
const ELEMENT_NODE = {
  nodeType: Node.ELEMENT_NODE,
  tagName: TAG_NAME,
  getAttribute,
  childNodes: [],
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
