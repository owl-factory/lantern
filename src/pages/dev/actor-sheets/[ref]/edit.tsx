import { Page } from "components/design";
import { ActorSheetForm } from "components/reroll/actorSheets/Form";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";
import { ActorSheetDocument } from "types/documents/ActorSheet";

/**
 * Renders a page for editing an already existing actor sheet's layout
 */
function EditActorSheet() {
  const router = useRouter();
  const ref = router.query.ref as string;
  
  // Ensures that the actor sheet is loaded
  React.useEffect(() => {
    ActorSheetData.load(ref);
  }, [ref]);

  const actorSheet = ActorSheetData.get(ref);

  // Ensures that the dependent ruleset is loaded
  React.useEffect(() => {
    if (actorSheet && actorSheet.ruleset && actorSheet.ruleset.ref) {
      RulesetData.load(actorSheet.ruleset.ref);
    }
  }, [actorSheet]);

  const ruleset = RulesetData.get(actorSheet?.ruleset?.ref);

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
      <h1>Edit {actorSheet.name}</h1>
      <i>A {ruleset.name} actor sheet</i>
      <ActorSheetForm ruleset={ruleset.ref as string} actorSheet={actorSheet} onSubmit={save}/>
    </Page>
  )
}

export default observer(EditActorSheet);
