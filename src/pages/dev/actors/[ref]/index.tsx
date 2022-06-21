import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { ActorSheet } from "components/sheets/ActorSheet";
import { ActorController } from "controllers/actor/ActorController";
import { ActorData } from "controllers/data/ActorData";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import { CampaignData } from "controllers/data/CampaignData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import React from "react";

/**
 * Renders a page for viewing a single actor
 */
function ActorView() {
  const router = useRouter();
  const ref = router.query.ref as string;
  let renderID = "";

  React.useEffect(() => {
    ActorData.load(ref);
  }, [ref]);

  // Ensures that the actor sheet and campaign are loaded in
  const actor = ActorData.get(ref);
  React.useEffect(() => {
    if (!actor) { return; }
    RulesetData.load(actor.ruleset?.ref as string);
    if (actor.actorSheet) { ActorSheetData.load(actor.actorSheet.ref); }
    if (actor.campaign) { CampaignData.load(actor.campaign.ref); }

    renderID = ActorController.createRender(ref, actor.actorSheet?.ref as string, actor.campaign?.ref as string);
  });

  // Ensures that the actor sheet is loaded in to the sheet controller
  const actorSheet = ActorSheetData.get(actor?.actorSheet?.ref);
  React.useEffect(() => {
    if (!actorSheet || !actorSheet.ref) { return; }
    ActorController.loadSheet(actorSheet.ref, actorSheet.xml || "");
  }, [actorSheet]);

  if (!actor) { return <></>; }

  /**
   * Submits the updated values of an actor to the database
   * @param values The new actor values to save
   */
  function onSubmit(values: Record<string, unknown>) {
    if (!actor) { return; }
    actor.values = values;
    ActorData.update(actor);
  }

  return (
    <Page>
      <div style={{ display: "flex" }}>
        <h1>{actor.name}</h1>&nbsp;
        <Button onClick={() => router.push("/dev/actors")}>Back</Button>
      </div>
      <ActorSheet id={actor.ref as string} onSubmit={onSubmit} values={actor.values}/>
    </Page>
  );
}

export default observer(ActorView);
