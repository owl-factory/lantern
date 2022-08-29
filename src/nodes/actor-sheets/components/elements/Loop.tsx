import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets";
import { SheetElementProps, SheetProperties } from "nodes/actor-sheets/types";
import { LoopDescriptor } from "nodes/actor-sheets/types/elements/loop";
import React from "react";
import { SheetChildren } from "./Children";

/**
 * Loops through a given list and prints the contained elements repeatedly
 */
export const SheetLoop = observer((props: SheetElementProps<LoopDescriptor>) => {
  const key = props.element.key; // The key used for storing the variable
  if (key in props.properties) { return <>Error with loop. The key is already in use</>; }

  const loopedElements = [];
  let list: (string | Record<string, string>)[] = [];
  if (props.element.listSource) {
    const listValue = ActorController.convertVariableToData(
      props.renderID,
      props.element.listSource,
      props.properties as any
    );
    if (typeof listValue === "string") { list = listValue.split(props.element.delimiter); }
    else if (Array.isArray(listValue)) { list = listValue; }
    else { list = []; }
  }
  else if (props.element.list) {
    list = props.element.list;
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

    loopedElements.push(<SheetChildren key={prefix} {...props} properties={properties}/>);
    i++;
  }

  return (
    <>
      {loopedElements}
    </>
  );
});
