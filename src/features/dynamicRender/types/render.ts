import { Attribute } from "features/dynamicRender/types/attributes";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import { ReactNode } from "react";

type UnknownAttributes = Record<string, Attribute | undefined>;

/**
 * The common props used within the Render Components
 */
export type RenderComponentProps<T = UnknownAttributes> = {
  /** The name of the node for debugging reasons */
  nodeName: string;
  /** The type of node this is expected to be */
  nodeType: NodeType;
  /** The Node object from the Markup */
  node: Node;
  /** The parsed children of this component */
  childNodes?: ParsedNode[];
  /** The attributes of a node */
  attributes: T;
};

/** The common shared between all Render Components */
export type RenderComponent<T = UnknownAttributes> = (props: RenderComponentProps<T>) => ReactNode;

/** A bundle of like attributes for a RenderComponent */
export type RenderComponentDefinition = {
  Component: RenderComponent;
  nodeType: NodeType;
  allowsChildren: boolean;
  attributes: AttributeDefinition[];
  /** Deprecated Node Types that map to this component */
  backwardsCompatiblityNodeTypes?: NodeType[];

  /** Any extra functionality to run for this specific type of component */
  customParsing?: (node: Node, attributes: UnknownAttributes) => void;
};

/**
 * A node parsed into an object for easier rendering
 */
export type ParsedNode<T = Record<string, string>> = {
  /** The unique component key for React */
  key: string;
  /** The component function to render this specific node */
  Component: RenderComponent<T>;
  /** Any arguments that should be available within the rendered component */
  props: RenderComponentProps;
};
