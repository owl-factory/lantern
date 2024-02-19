import { voidBundle } from "features/dynamicRender/components/utility/Void";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentDefinition } from "features/dynamicRender/types/render";
import { observer } from "lib/mobx";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicComponentRegistry = new Map<NodeType, RenderComponentDefinition<any>>();

/**
 * Registers a Render Component for use within the DynamicRender
 * @param nodeName - The name of the node to register this component under
 * @param component - The component to register
 */
export function registerComponentDefinition<T extends object>(
  componentDefinition: RenderComponentDefinition<T>
) {
  const nodeType = componentDefinition.nodeType;
  const Component = observer(componentDefinition.Component);

  dynamicComponentRegistry.set(nodeType, {
    ...componentDefinition,
    Component,
  });

  if (!componentDefinition.backwardsCompatiblityNodeTypes) return;
  componentDefinition.backwardsCompatiblityNodeTypes.forEach((nodeType: NodeType) => {
    dynamicComponentRegistry.set(nodeType, {
      ...componentDefinition,
      Component,
    });
  });
}

/**
 * Fetches a Render Component for the given nodeName. If no Render Component is found,
 * a Void component is returned instead
 * @param nodeName - The name under which a Component is registered
 * @returns A Render Component function
 */
export function getRenderComponentBundle(nodeType: NodeType): RenderComponentDefinition {
  const bundle = dynamicComponentRegistry.get(nodeType);
  if (!bundle) return voidBundle;
  return bundle;
}
