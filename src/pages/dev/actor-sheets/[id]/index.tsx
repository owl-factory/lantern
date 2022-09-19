import { Button } from "@chakra-ui/react";
import { Page } from "components/design";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ActorController } from "nodes/actor-sheets";
import { ActorSheet } from "@prisma/client";
import { ActorSheetComponent } from "nodes/actor-sheets/components/ActorSheet";

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
  const ref = router.query.id as string;
  const renderID = ActorController.newRender("temp", ref, "temp");

  const actorSheet = {} as ActorSheet;
  React.useEffect(() => {
    if (!actorSheet) { return; }
    ActorController.loadSheet(ref, { layout: actorSheet.layout as string } as ActorSheet);
  }, [actorSheet]);
  return (
    <Page>
      <div style={{display: "flex"}}>
        <h1>{actorSheet?.name}</h1>&nbsp;
        <Link href="/dev/actor-sheets"><Button>Back</Button></Link>
      </div>
      <hr/>
      <ActorSheetComponent id={renderID}/>
    </Page>
  );
}

export default observer(ViewActorSheet);
