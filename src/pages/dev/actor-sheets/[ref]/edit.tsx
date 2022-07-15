import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { ActorSheetForm } from "components/reroll/actorSheets/Form";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActorController } from "nodes/actor-sheets";
import React from "react";
import { ActorSheetDocument } from "types/documents/ActorSheet";

/**
 * Renders a page for editing an already existing actor sheet's layout
 */
function EditActorSheet() {
  const router = useRouter();
  const ref = router.query.ref as string;

  const [ renderID, setRenderID ] = React.useState("");

  // Ensures that the actor sheet is loaded
  React.useEffect(() => { ActorSheetData.load(ref); }, [ref]);

  const actorSheet = ActorSheetData.get(ref);

  // Ensures that the dependent ruleset is loaded and creates the render ID
  React.useEffect(() => {
    if (actorSheet && actorSheet.ruleset && actorSheet.ruleset.ref) {
      setRenderID(ActorController.createRender(null, "temp", actorSheet.ruleset.ref));
      RulesetData.load(actorSheet.ruleset.ref);
    }
  }, [actorSheet]);

  // Ensures that the ruleset is loaded into the controller
  const ruleset = RulesetData.get(actorSheet?.ruleset?.ref);
  React.useEffect(() => {
    if (ruleset && ruleset.ref) { ActorController.loadRuleset(ruleset.ref, ruleset); }
  }, [ruleset]);

  // Return an empty case if either the actor sheet or ruleset are not present
  if (!actorSheet || !ruleset) { return <></>; }

  /**
   * The function to run on form submit. Updates an existing actor sheet
   * @param values The updated actor sheet values to save
   */
  function save(values: Partial<ActorSheetDocument>) {
    if (!ruleset?.ref) { return; }
    values.ruleset = { ref: ruleset.ref };
    ActorSheetData.update(values).then(() => {
      router.push(`/dev/actor-sheets`);
    });
  }

  return (
    <Page>
      <div style={{display: "flex"}}>
        <h1>Edit {actorSheet.name}</h1>&nbsp;
        <Link href="/dev/actor-sheets"><Button>Back</Button></Link>
      </div>
      <i>A {ruleset.name} actor sheet</i>
      <hr/>
      <ActorSheetForm renderID={renderID} ruleset={ruleset.ref as string} actorSheet={actorSheet} onSubmit={save}/>
    </Page>
  );
}

export default observer(EditActorSheet);
