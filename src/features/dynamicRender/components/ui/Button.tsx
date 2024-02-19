import { StateContext } from "features/dynamicRender/context/stateContext";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { StateController } from "features/dynamicRender/utils/stateController";
import { useContext, useMemo } from "react";
import { normalize } from "utils/strings";

const DEFAULT_CLASSES = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

export type ButtonAttributes = {
  action: string;
  target?: string;
};

export const attributeDefinitions: AttributeDefinition[] = [
  { name: "action", required: true },
  { name: "target" },
];

/**
 * Renders a button that performs some action when clicked
 */
export function Button(props: RenderComponentProps<ButtonAttributes>) {
  const { attributes } = useAttributes<ButtonAttributes>(props.node, attributeDefinitions);
  const state = useContext(StateContext);
  const action = useMemo(() => buildAction(attributes, state), [attributes, state]);

  const children = useChildren(props.childNodes);

  return (
    <button className={DEFAULT_CLASSES} type="button" onClick={() => action()}>
      {children}
    </button>
  );
}

/**
 * Builds an action for use with a button
 * @param attributes - The button attributes to build an action for
 * @param context - The Dynamic Render context
 * @returns A function that runs the action when triggered
 */
function buildAction(attributes: Partial<ButtonAttributes>, state: StateController) {
  const action = normalize(attributes.action ?? "", true);
  switch (action) {
    case "collapse": {
      const target = attributes.target;
      if (target === undefined) break;
      return () => state.toggleCollapse(target);
    }
  }
  return () => {};
}

export const buttonBundle: RenderComponentDefinition<ButtonAttributes> = {
  Component: Button,
  nodeType: NodeType.Button,
  attributeDefinitions,
  allowsChildren: true,
};
