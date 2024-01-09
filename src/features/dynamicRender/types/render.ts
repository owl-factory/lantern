import { ReactNode } from "react";

/**
 * The common props used within the Render Components
 */
export type RenderComponentProps = {
  nodeName: string;
  node: Node;
};

/** The common shared between all Render Components */
export type RenderComponent = (props: RenderComponentProps) => ReactNode;

/**
 * A node parsed into an object for easier rendering
 */
export type ParsedNode = {
  key: string;
  Component: RenderComponent;
  props: RenderComponentProps;
};
