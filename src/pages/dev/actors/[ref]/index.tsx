import { Button } from "@owl-factory/components/button";
import { Actor, ActorSheet, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { ActorSheetComponent } from "nodes/actor-sheets/components/ActorSheet";
import { Mediator } from "nodes/mediator";
import React from "react";
import { Scalar } from "types";
import { RulesetDocument } from "types/documents";

/**
 * Renders a page for viewing a single actor
 */
function ActorView() {
  const router = useRouter();
  const ref = router.query.ref as string;
  const [ renderID, setRenderID ] = React.useState("");

  // Initializes the Mediator
  React.useEffect(() => {
    Mediator.set(ActorSheetMediatorHandler);
    return () => { Mediator.reset(); };
  }, []);

  // Ensures that the actor sheet is loaded in to the sheet controller
  const actor = {} as Actor;
  const actorSheet = {} as ActorSheet;
  const ruleset = {} as Ruleset;

  // Ensures that the ruleset is loaded in to the sheet controller

  if (!actor) { return <></>; }

  /**
   * Submits the updated values of an actor to the database
   * @param values The new actor values to save
   */
  function onSubmit(values: Record<string, Scalar>) {
    if (!actor) { return; }
  }

  return (
    <Page>
      <div style={{ display: "flex" }}>
        <h1>{actor.name}</h1>&nbsp;
        <Button onClick={() => router.push("/dev/actors")}>Back</Button>
      </div>
      <ActorSheetComponent id={renderID} onSubmit={onSubmit}/>
    </Page>
  );
}

export default observer(ActorView);
