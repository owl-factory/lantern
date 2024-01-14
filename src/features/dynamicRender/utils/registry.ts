import { voidBundle } from "features/dynamicRender/components/utility/Void";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle } from "features/dynamicRender/types/render";
import { observer } from "lib/mobx";

const dynamicComponentRegistry = new Map<NodeType, RenderComponentBundle>();

/**
 * Registers a Render Component for use within the DynamicRender
 * @param nodeName - The name of the node to register this component under
 * @param component - The component to register
 */
export function registerBundle(bundle: RenderComponentBundle) {
  dynamicComponentRegistry.set(bundle.nodeType, { ...bundle, Component: observer(bundle.Component) });
}

/**
 * Fetches a Render Component for the given nodeName. If no Render Component is found,
 * a Void component is returned instead
 * @param nodeName - The name under which a Component is registered
 * @returns A Render Component function
 */
export function getRenderComponentBundle(nodeType: NodeType): RenderComponentBundle {
  return dynamicComponentRegistry.get(nodeType) ?? voidBundle;
}
