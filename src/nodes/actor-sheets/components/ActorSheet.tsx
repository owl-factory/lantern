import { Button } from "@owl-factory/components/button";
import { ActorData } from "controllers/data/ActorData";
import { observer } from "mobx-react-lite";
import React from "react";
import { Scalar } from "types";
import { ActorController } from "../controllers/ActorController";
import { SheetProperties } from "../types";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  id: string;
  onSubmit?: (values: Record<string, Scalar>) => void;
}

/**
 * Renders an actor sheet
 * @param id The ref or temporary key of a sheet to load
 */
export const ActorSheet = observer((props: ActorSheetProps) => {
  const sheet = ActorController.getSheet(props.id);
  const properties: SheetProperties = {
    $prefix: props.id,
    $source: {},
    $index: {},
  };

  // Renders each of the children of the base sheet
  const sheetElements: JSX.Element[] = [];
  for(const childElement of sheet.children || []) {
    sheetElements.push(
      <SheetElement
        key={props.id + childElement.$key}
        id={props.id}
        element={childElement}
        properties={properties}
      />
    );
  }

  /**
   * Takes the actor values and saves them into the appropriate actor
   */
  function save() {
    const actorRef = ActorController.getActorRef(props.id);
    const actor = ActorData.get(actorRef);
    if (!actor) { return; }
    const updatedActor = ActorController.getActor(props.id);
    ActorData.update(updatedActor);
  }

  return (
    <>
      <Button type="button" onClick={save}>Save</Button>
      {sheetElements}
    </>
  );
});

