import { gql, useLazyQuery } from "@apollo/client";
import { Alerts } from "@owl-factory/alerts";
import { ActorController, ActorSheet } from "nodes/actor-sheets";
import { ViewRender, ViewRenderer, ViewType } from "nodes/view-renderer";
import React from "react";
import { SheetForm } from "./SheetForm";

interface SheetViewProps {
  sheetID: string | undefined;
}

// Gets the actor sheet for editing
const GET_ACTOR_SHEET = gql`
  query GetActorSheet($id: String!) {
    actorSheet(id: $id) {
      id,
      layout,
      rawStyling,
      styling,
      rulesetID,
    }
  }
`;

/**
 * Renders a view for editing the current sheet
 * @param activeSheet The active sheet ID, if any
 */
export function SheetView(props: SheetViewProps) {
  const [ getSheet, { data, loading, error }] = useLazyQuery(GET_ACTOR_SHEET);

  // Handles the changing actor, allowing the sheet to update
  React.useEffect(() => {
    if (props.sheetID === undefined) { return; }

    getSheet({ variables: { id: props.sheetID } });
    const previousSheet = props.sheetID;

    return () => {
      ActorController.endRender(previousSheet);
    };
  }, [props.sheetID]);

  // Loads and creates the render
  React.useEffect(() => {
    if (loading || error || !data || props.sheetID === undefined) { return; }
    ViewRenderer.import(
      data.actorSheet.id,
      ViewType.ActorSheet,
      { xml: data.actorSheet.layout, css: data.actorSheet.styling }
    );
  });

  if (props.sheetID === null) {
    return <>Select a character sheet</>;
  }

  // Required for posting the Alert without issue
  React.useEffect(() => {
    if (!error) return;
    Alerts.error({ title: "GraphQL Error", description: "An error has occured when attempting to fetch a character."});
  }, [error]);

  if (loading || data === undefined) { return <>Loading</>; }
  if (error) { return <></>; }

  return (
    <>
      <SheetForm sheet={data.actorSheet}/>
      <ViewRender viewID={props.sheetID} sources={{ actorID: "", rulesetID: data.actorSheet.rulesetID }}/>
    </>
  );
}
