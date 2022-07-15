import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets";
import { SheetElementProps, SheetProperties } from "nodes/actor-sheets/types";
import { LoopDescriptor } from "nodes/actor-sheets/types/elements/loop";
import { Expression } from "nodes/actor-sheets/types/expressions";
import React from "react";
import { SheetElement } from "../SheetElement";

/**
 * Renders each item of a loop
 */
function SheetLoopItem(props: SheetElementProps<LoopDescriptor>) {
  const childElements = props.element.children || [];
  const elements: JSX.Element[] = [];
  for (const childElement of childElements) {
    elements.push(
      <SheetElement
        key={props.properties.$prefix + childElement.$key}
        id={props.id}
        element={childElement}
        properties={props.properties}
      />
    );
  }
  return (
    <>
      {elements}
    </>
  );
}

/**
 * Loops through a given list and prints the contained elements repeatedly
 */
export const SheetLoop = observer((props: SheetElementProps<LoopDescriptor>) => {
  const key = props.element.key; // The key used for storing the variable
  if (key in props.properties) { return <>Error with loop. The key is already in use</>; }

  const loopedElements = [];
  let variableName;
  let list: (string | Record<string, string>)[] = [];
  if (!props.element.list.isExpression) { list = props.element.list.value.split(props.element.delimiter); }
  else {
    list = [];
    // const expr = props.element.list[0] as Expression;
    // // TODO - fix this super jank variable name get
    // variableName = (props.element.list[0] as Expression).items[0].value;
    // list = ActorController.convertVariableToData(
    //   props.id,
    //   variableName || "",
    //   props.properties as any
    // ) as (string | Record<string, string>)[];
    // if (list === undefined) { list = []; }
  }

  let i = 0;
  for (const listItem of list) {
    const prefix = `${props.properties.$prefix}-${key}_${i}`; // Updated prefix to contain a loop-specific variable
    const properties: SheetProperties = {
      ...props.properties,
      $source: { ...props.properties.$source },
      $index: {...props.properties.$index, [key]: i },
      [key]: listItem,
    };
    if (variableName) { properties.$source[key] = variableName; }

    if (props.element.index) { properties[props.element.index] = i; }

    loopedElements.push(
      <SheetLoopItem key={prefix} {...props} properties={properties}/>
    );
    i++;
  }

  return (
    <>
      {loopedElements}
    </>
  );
});
