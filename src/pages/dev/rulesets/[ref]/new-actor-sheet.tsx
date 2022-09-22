import { Button } from "@chakra-ui/react";
import { Page } from "components/design";
import { ActorSheetForm } from "nodes/actor-sheets";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActorController } from "nodes/actor-sheets";
import React from "react";
import { ActorSheetDocument } from "types/documents/ActorSheet";
import { ActorSheet, Ruleset } from "@prisma/client";

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
  const [ renderID, setRenderID ] = React.useState("");

  const ruleset = {} as Ruleset;
  // Creates the render once
  React.useEffect(() => {
    if (ruleset && ruleset.id) {
      setRenderID(ActorController.newRender("temp", "temp", ruleset.id));
    }
  }, [ruleset]);

  if (!ruleset) { return <LoadNewActorSheet/>; }

  /**
   * Creates a new actor sheet
   * @param values The new actor sheet to create
   */
  function save(values: Partial<ActorSheet>) {
    // TODO - save!
    router.push(`/dev/actor-sheets`);
  }

  return (
    <Page>
      <h1>New {ruleset.name} Actor Sheet</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ActorSheetForm renderID={renderID} ruleset={ref} onSubmit={save}/>
    </Page>
  );
}

export default observer(NewActorSheet);
