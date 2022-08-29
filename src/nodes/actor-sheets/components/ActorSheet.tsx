import { Button } from "@owl-factory/components/button";
import { isValidRef } from "@owl-factory/data/utilities/fields";
import { ActorData } from "controllers/data/ActorData";
import { observer } from "mobx-react-lite";
import React from "react";
import { Scalar } from "types";
import { ActorController } from "../controllers/ActorSheetController";
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
        $key={props.id + childElement.$key}
        renderID={props.id}
        element={childElement}
        properties={properties}
      />
    );
  }

  /**
   * Takes the actor values and saves them into the appropriate actor
   */
  function save() {
    const actor= ActorController.exportActor(props.id);
    if (!isValidRef(actor.ref)) { return; } // Don't save any test actors
    ActorData.update(actor);
  }

  return (
    <>
      <Button type="button" onClick={save}>Save</Button>
      {sheetElements}
    </>
  );
});

