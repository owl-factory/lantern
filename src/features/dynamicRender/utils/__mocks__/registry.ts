import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle } from "features/dynamicRender/types/render";

const mockComponentBundle: RenderComponentBundle = {
  attributes: [],
  Component: jest.fn(),
  nodeType: NodeType.Box,
};

export const registerBundle = jest.fn();
export const getRenderComponentBundle = jest.fn(() => mockComponentBundle);
