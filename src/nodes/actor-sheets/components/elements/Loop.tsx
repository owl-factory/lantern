import { ActorController } from "controllers/actor/ActorController";
import { observer } from "mobx-react-lite";
import React from "react";
import { LoopElementDescriptor } from "types/sheetElementDescriptors/loop";
import { SheetElement } from "../SheetElement";
import { SheetElementProps } from "../types";

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
  console.log("element1", props.element)

  const loopedElements = [];
  let list: (string | Record<string, string>)[] = [];
  if (props.element.listType === "static") { list = props.element.list; }
  else {
    list = ActorController.renderVariable(props.id, props.element.list, props.properties as any) as any; 
    console.log("element2", props.element)
  }

  for (const listItem of list) {
    const properties = {...props.properties, [key]: listItem};
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
