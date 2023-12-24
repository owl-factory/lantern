import { isArray } from "@apollo/client/cache/inmemory/helpers";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { ExpressionVariableType } from "nodes/view-renderer/enums/expressionVariableType";
import { LoopAttributes } from "nodes/view-renderer/types/attributes";
import { ExpressionVariable } from "nodes/view-renderer/types/expression";
import { RenderProperties, RenderProps } from "nodes/view-renderer/types/renderProps";
import { parseExpressionVariable } from "nodes/view-renderer/utilities/parse/layout/expression";
import { runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewChildren } from "./Children";

type ListItems = (string | Record<string, unknown>)[];

/**
 * Renders a checkbox for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewLoop = observer((props: RenderProps<LoopAttributes>) => {
  const [ listSource, setListSource ] = React.useState<ExpressionVariable | undefined>();
  const key = props.element.attributes.key; // The key used for storing the variable

  // Determines the list source. Function is required for determining an expression, such as one
  // provided by a loop.
  React.useEffect(() => {
    getListSource(
      props.renderID,
      props.element.attributes,
      props.properties
    ).then((res: ExpressionVariable | undefined) => {
      setListSource(res);
    });
  }, []);

  const list = getList(props.renderID, { list: props.element.attributes.list, listSource });

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
    if (listSource) {
      properties.$source[key] = listSource.fullVariable;
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

/**
 * Determines the listSource value, including running an expression if needed
 * @param renderID The ID of the current render
 * @param attributes The attributes of the parsed loop element
 * @param properties The current state of the actor sheet at this time of rendering
 * @returns The listSource that the loop uses
 */
async function getListSource(renderID: string, attributes: LoopAttributes, properties: RenderProperties) {
  if (attributes.list) { return undefined; }

  const sources = ViewRenderer.renders[renderID].sources;
  let listSource;
  if (attributes.listSource) { listSource = attributes.listSource; }
  else if (attributes.listSourceExpression) {
    listSource = parseExpressionVariable(await runExpression(sources, attributes.listSourceExpression, properties));
  }

  return listSource;
}

/**
 * Determines the value of a list for the given list or listSource attribute
 * @param renderID The ID of the current render
 * @param attributes The list and listSource element of the render
 * @returns An array of list items
 */
function getList(renderID: string, attributes: Partial<LoopAttributes>): ListItems {
  if (attributes.list) { return attributes.list; }

  const sources = ViewRenderer.renders[renderID].sources;

  if (!attributes.listSource) { return []; }

  switch(attributes.listSource?.type) {
    case ExpressionVariableType.Content:
      if (!sources.actorID || !attributes.listSource.field) return [];
      return ActiveData.getContents(sources.actorID, attributes.listSource.field) || [];
    case ExpressionVariableType.Ruleset:
      if (!sources.rulesetID || !attributes.listSource.field) return [];
      const rule = ActiveData.getRule(sources.rulesetID, attributes.listSource.field) as unknown[];
      if (!rule || !isArray(rule)) return [];
      return rule as (string | Record<string, unknown>)[];
    case ExpressionVariableType.Sheet:
      //TODO
      return [];
  }
  return [];
}
