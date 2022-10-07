import { Button } from "@chakra-ui/react";
import { Alerts } from "@owl-factory/alerts";
import { rest } from "@owl-factory/https";
import { ActorSheet, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ActorController, ActorSheetForm } from "nodes/actor-sheets";
import { Mediator } from "nodes/mediator";
import React from "react";

interface EditActorSheet {
  actorSheet: ActorSheet;
  ruleset: Ruleset;
}

/**
 * Renders a page for editing an already existing actor sheet's layout
 */
function EditActorSheet(props: EditActorSheet) {
  const router = useRouter();

  const [ renderID, setRenderID ] = React.useState(props.actorSheet.id);
  const actorSheet = props.actorSheet;
  const ruleset = props.ruleset;

  // Initializes the Mediator
  React.useEffect(() => {
    Mediator.set(ActorSheetMediatorHandler);
    ActorController.newRender("", ruleset.id, "development-sheet");
    return () => { Mediator.reset(); };
  }, []);

  // Return an empty case if either the actor sheet or ruleset are not present
  if (!actorSheet || !ruleset) { return <></>; }

  /**
   * The function to run on form submit. Updates an existing actor sheet
   * @param values The updated actor sheet values to save
   */
  async function save(values: Partial<ActorSheet>) {
    try {
      const result = await rest.patch(`/api/dev/actor-sheets/${actorSheet.id}`, { actorSheet: values });
      if (!result.success) {
        Alerts.error({ title: `${values.name} could not be updated. ${result.message}` });
        return;
      }
      Alerts.success({ title: `${values.name} was successfully updated!` });
      router.push(`/dev/actor-sheets`);
      return;
    } catch (e) {
      Alerts.error({ title: `An unexpected error occured while attempting to save ${values.name}. ${e}` });
    }
  }

  return (
    <Page>
      <div style={{display: "flex"}}>
        <h1>Edit {actorSheet.name}</h1>&nbsp;
        <Link href="/dev/actor-sheets"><Button>Back</Button></Link>
      </div>
      <i>A {ruleset.name} actor sheet</i>
      <hr/>
      <ActorSheetForm renderID={renderID} ruleset={ruleset} actorSheet={actorSheet} onSubmit={save}/>
    </Page>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  return { props: { actorSheet: {}, ruleset: {} } };
}

export default observer(EditActorSheet);
