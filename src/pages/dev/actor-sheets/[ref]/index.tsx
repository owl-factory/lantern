import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { ActorSheet } from "components/sheets/ActorSheet";
import { ActorController } from "controllers/actor/ActorController";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

/**
 * Renders a palceholder loading page for the ViewActorSheet element
 */
function ViewActorSheetLoading() {
  return <>Loading</>;
}

/**
 * Renders a page containing an actor sheet for viewing and testng purposes.
 * It does not allow for creating or editing an actor
 */
function ViewActorSheet() {
  const router = useRouter();
  const ref = router.query.ref as string;
  const renderID = ActorController.createRender(null, ref, null);

  React.useEffect(() => {
    ActorSheetData.load(ref);
  }, [ref]);

  const actorSheet = ActorSheetData.get(ref);
  React.useEffect(() => {
    if (!actorSheet) { return; }
    ActorController.loadSheet(ref, actorSheet.xml as string);
  }, [actorSheet]);
  return (
    <Page>
      <div style={{display: "flex"}}>
        <h1>{actorSheet?.name}</h1>&nbsp;
        <Link href="/dev/actor-sheets"><Button>Back</Button></Link>
      </div>
      <hr/>
      <ActorSheet id={renderID}/>
    </Page>
  );
}

export default observer(ViewActorSheet);
