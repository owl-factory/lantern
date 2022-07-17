import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets";
import { Expression, SheetElementProps, SheetProperties } from "nodes/actor-sheets/types";
import { LoopElementDescriptor } from "nodes/actor-sheets/types/elements/loop";
import React from "react";
import { SheetElement } from "../SheetElement";

function SheetLoopItem(props: SheetElementProps<LoopElementDescriptor>) {
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

export const SheetLoop = observer((props: SheetElementProps<LoopElementDescriptor>) => {
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

  for (const listItem of list) {
    const properties: SheetProperties = {...props.properties, [key]: listItem};
    loopedElements.push(
      <SheetLoopItem key={listItem.toString()} {...props} properties={properties}/>
    );
  }

  return (
    <div>
      {loopedElements}
    </div>
  );
});
