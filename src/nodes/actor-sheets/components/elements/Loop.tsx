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
      <SheetElement key={Math.random()} id={props.id} element={childElement} properties={props.properties}/>
    );
  }
  return (
    <div>
      {elements}
    </div>
  );
}

/**
 * Loops through a given list and prints the contained elements repeatedly
 */
export const SheetLoop = observer((props: SheetElementProps<LoopDescriptor>) => {
  const key = props.element.key; // The key used for storing the variable
  if (key in props.properties) { return <>Error with loop. The key is already in use</>; }

  const loopedElements = [];
  let list: (string | Record<string, string>)[] = [];
  if (props.element.listType === "static") { list = props.element.list as string[]; }
  else {
    // TODO - fix this super jank functionality
    list = ActorController.convertVariableToData(
      props.id,
      (props.element.list[0] as Expression).items[0].value || "",
      props.properties as any
    );
    if (list === undefined) { list = []; }
  }

  let i = 0;
  for (const listItem of list) {
    const properties: SheetProperties = {...props.properties, [key]: listItem};
    if (props.element.index) { properties[props.element.index] = i; }
    loopedElements.push(
      <SheetLoopItem key={listItem.toString()} {...props} properties={properties}/>
    );
    i++;
  }

  return (
    <div>
      {loopedElements}
    </div>
  );
});
