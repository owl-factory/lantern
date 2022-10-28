import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { CheckboxAttributes, LoopAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewChildren } from "./Children";

/**
 * Renders a checkbox for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewLoop = observer((props: RenderProps<LoopAttributes>) => {
  const key = props.element.key; // The key used for storing the variable
  if (key in props.properties) { return <>Error with loop. The key is already in use</>; }

  const loopedElements = [];
  let list: (string | Record<string, string>)[] = [];
  if (props.element.attributes.listSource) {
    const listValue = ActorController.convertVariableToData(
      props.renderID,
      props.element.listSource,
      props.properties as any
    );
    if (typeof listValue === "string") { list = listValue.split(props.element.delimiter); }
    else if (Array.isArray(listValue)) { list = listValue; }
    else { list = []; }
  }
  else if (props.element.attributes.list) {
    list = props.element.attributes.list;
  }

  let i = 0;
  for (const listItem of list) {
    const prefix = `${props.properties.$prefix}-${key}_${i}`; // Updated prefix to contain a loop-specific variable
    const properties: SheetProperties = {
      ...props.properties,
      $source: { ...props.properties.$source },
      $index: {...props.properties.$index, [key]: i },
      $prefix: prefix,
      [key]: toJS(listItem),
    };
    if (props.element.listSource) { properties.$source[key] = props.element.listSource; }

    if (props.element.index) { properties[props.element.index] = i; }

    loopedElements.push(<ViewChildren key={prefix} {...props} properties={properties}/>);
    i++;
  }

  return (
    <>
      {loopedElements}
    </>
  );
});

function getListSource(renderID: string, listSource: string): string | Record<string, string>[] {

}
