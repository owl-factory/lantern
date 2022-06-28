import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { ActorSheetForm } from "components/reroll/actorSheets/Form";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ActorSheetDocument } from "types/documents/ActorSheet";

/**
 * Renders placeholder mockup while the new actor sheet is loading
 */
function LoadNewActorSheet() {
  return <></>;
}

/**
 * Renders a page for creating a new actor sheet
 */
function NewActorSheet() {
  const router = useRouter();
  const ref = router.query.ref as string;

  // Ensures the ruleset is loaded
  React.useEffect(() => {
    RulesetData.load(ref);
  }, [ref])

  const ruleset = RulesetData.get(ref);
  if (!ruleset) { return <LoadNewActorSheet/>; }

  /**
   * Creates a new actor sheet
   * @param values The new actor sheet to create
   */
  function save(values: Partial<ActorSheetDocument>) {
    values.ruleset = { ref: ref };
    ActorSheetData.create(values);
    router.push(`/dev/actor-sheets`);
  }

  return (
    <Page>
      <h1>New {ruleset.name} Actor Sheet</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ActorSheetForm ruleset={ref} onSubmit={save}/>
    </Page>
  );
}

export default observer(NewActorSheet);
