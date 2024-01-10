import { Void } from "features/dynamicRender/components/utility/Void";
import { RenderComponent } from "features/dynamicRender/types/render";

const dynamicComponentRegistry = new Map<string, RenderComponent>();

/**
 * Registers a Render Component for use within the DynamicRender
 * @param nodeName - The name of the node to register this component under
 * @param component - The component to register
 */
export function registerComponent(nodeName: string, component: RenderComponent) {
  dynamicComponentRegistry.set(nodeName, component);
}

/**
 * Fetches a Render Component for the given nodeName. If no Render Component is found,
 * a Void component is returned instead
 * @param nodeName - The name under which a Component is registered
 * @returns A Render Component function
 */
export function getRenderComponentByName(nodeName: string): RenderComponent {
  return dynamicComponentRegistry.get(nodeName) ?? Void;
}
