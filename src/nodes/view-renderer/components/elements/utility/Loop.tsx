import { isArray } from "@apollo/client/cache/inmemory/helpers";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { ExpressionVariableType } from "nodes/view-renderer/enums/expressionVariableType";
import { LoopAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProperties, RenderProps } from "nodes/view-renderer/types/renderProps";
import React from "react";
import { ViewChildren } from "./Children";

/**
 * Renders a checkbox for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewLoop = observer((props: RenderProps<LoopAttributes>) => {
  const key = props.element.attributes.key; // The key used for storing the variable

  const list = getList(props.renderID, props.element.attributes);
  const loopedElements = [];

  let i = 0;
  for (const listItem of list) {
    const prefix = `${props.properties.$prefix}-${key}_${i}`; // Updated prefix to contain a loop-specific variable
    const properties: RenderProperties = {
      ...props.properties,
      $source: { ...props.properties.$source },
      $index: {...props.properties.$index, [key]: i },
      $prefix: prefix,
      [key]: toJS(listItem),
    };
    if (props.element.attributes.listSource) {
      properties.$source[key] = props.element.attributes.listSource.fullVariable;
    }

    if (props.element.attributes.index) { properties[props.element.attributes.index] = i; }

    loopedElements.push(
      <ViewChildren
        key={prefix}
        renderID={props.renderID}
        elements={props.element.children || []}
        properties={properties}
      />
    );
    i++;
  }

  return (
    <>
      {loopedElements}
    </>
  );
});

function getList(renderID: string, attributes: LoopAttributes): (string | Record<string, unknown>)[] {
  if (attributes.list) { return attributes.list; }
  const sources = ViewRenderer.renders[renderID].sources;

  switch(attributes.listSource?.type) {
    case ExpressionVariableType.Content:
      if (!sources.actorID || !attributes.listSource.field) return [];
      return ActiveData.getContents(sources.actorID, attributes.listSource.field) || [];
    case ExpressionVariableType.Ruleset:
      if (!sources.rulesetID || !attributes.listSource.field) return [];
      const rule = ActiveData.getRule(sources.rulesetID, attributes.listSource.field) as unknown[];
      console.log("RULE", rule)
      if (!rule || !isArray(rule)) return [];
      return rule as (string | Record<string, unknown>)[];
    case ExpressionVariableType.Sheet:
      //TODO
      return [];
  }
  return [];
}
