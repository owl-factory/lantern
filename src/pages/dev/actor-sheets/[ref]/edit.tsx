import { Button } from "@owl-factory/components/button";
import { ActorSheet, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActorController, ActorSheetForm } from "nodes/actor-sheets";
import { Mediator } from "nodes/mediator";
import React from "react";
import { ActorSheetDocument } from "types/documents/ActorSheet";

/**
 * Renders a page for editing an already existing actor sheet's layout
 */
function EditActorSheet() {
  const router = useRouter();
  const ref = router.query.ref as string;

  const [ renderID, setRenderID ] = React.useState("");
  const actorSheet = {} as ActorSheet;
  const ruleset = {} as Ruleset;

  // Initializes the Mediator
  React.useEffect(() => {
    Mediator.set(ActorSheetMediatorHandler);
    return () => { Mediator.reset(); };
  }, []);

  // Return an empty case if either the actor sheet or ruleset are not present
  if (!actorSheet || !ruleset) { return <></>; }

  /**
   * The function to run on form submit. Updates an existing actor sheet
   * @param values The updated actor sheet values to save
   */
  function save(values: Partial<ActorSheet>) {
    // if (!ruleset?.ref) { return; }
    // values.ruleset = { ref: ruleset.ref };
    // ActorSheetData.update(values).then(() => {
    //   router.push(`/dev/actor-sheets`);
    // });
  }

  return (
    <Page>
      <div style={{display: "flex"}}>
        <h1>Edit {actorSheet.name}</h1>&nbsp;
        <Link href="/dev/actor-sheets"><Button>Back</Button></Link>
      </div>
      <i>A {ruleset.name} actor sheet</i>
      <hr/>
      <ActorSheetForm renderID={renderID} ruleset={ruleset.id as string} actorSheet={actorSheet} onSubmit={save}/>
    </Page>
  );
}

export default observer(EditActorSheet);
