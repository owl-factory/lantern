import { Button } from "@owl-factory/components/button";
import { ActorController } from "controllers/actor/ActorController";
import { ActorData } from "controllers/data/ActorData";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  id: string;
  onSubmit?: (values: Record<string, unknown>) => void;
}

/**
 * Renders an actor sheet
 * @param id The ref or temporary key of a sheet to load
 */
export const ActorSheet = observer((props: ActorSheetProps) => {
  const sheet = ActorController.getSheet(props.id);

  // Renders each of the children of the base sheet
  const sheetElements: JSX.Element[] = [];
  for(const childElement of sheet.children || []) {
    sheetElements.push(
      <SheetElement id={props.id} element={childElement} properties={{}}/>
    );
  }

  /**
   * Takes the actor values and saves them into the appropriate actor
   */
  function save() {
    const actorRef = ActorController.getActorRef(props.id);
    const actor = ActorData.get(actorRef);
    if (!actor) { return; }
    const actorValues = ActorController.getActor(props.id);
    actor.values = actorValues;
    ActorData.update(actor);
  }

  return (
    <>
      <Button type="button" onClick={save}>Save</Button>
      {sheetElements}
    </>
  );
});

