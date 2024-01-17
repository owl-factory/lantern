import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentDefinition } from "features/dynamicRender/types/render";

const mockComponentBundle: RenderComponentDefinition = {
  attributes: [],
  Component: jest.fn(),
  nodeType: NodeType.Box,
  allowsChildren: true,
};

export const registerBundle = jest.fn();
export const getRenderComponentBundle = jest.fn(() => mockComponentBundle);
