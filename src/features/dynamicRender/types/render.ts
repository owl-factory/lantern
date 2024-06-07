import { Attributes } from "features/dynamicRender/types/attributes";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import { ReactNode } from "react";

/**
 * The common props used within the Render Components
 */
export type RenderComponentProps<T extends Attributes = Attributes> = Readonly<{
  /** The name of the node for debugging reasons */
  nodeName: string;
  /** The type of node this is expected to be */
  nodeType: NodeType;
  /** The Node object from the Markup */
  node: Node;
  /** The parsed children of this component */
  childNodes?: ParsedNode<Attributes>[];
  /** The attributes of a node */
  attributes: T;
}>;

/** The common shared between all Render Components */
export type RenderComponent<T extends Attributes = Attributes> = (
  props: RenderComponentProps<T>
) => ReactNode;

/** A bundle of like attributes for a RenderComponent */
export type RenderComponentDefinition<T extends Attributes = Attributes> = {
  Component: RenderComponent<T>;
  nodeType: NodeType;
  /** True if this component supports children */
  allowsChildren: boolean;
  /** Defines which attributes we will be attempting to read from the XML */
  attributeDefinitions: AttributeDefinition[];
  /** Deprecated Node Types that map to this component */
  backwardsCompatiblityNodeTypes?: NodeType[];
};

/**
 * A node parsed into an object for easier rendering
 */
export type ParsedNode<T extends Attributes = Attributes> = {
  /** The unique component key for React */
  key: string;
  /** The component function to render this specific node */
  Component: RenderComponent<T>;
  /** Any arguments that should be available within the rendered component */
  props: RenderComponentProps<T>;
};
