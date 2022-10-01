import { gql, useLazyQuery } from "@apollo/client";
import { ActorController, ActorSheet } from "nodes/actor-sheets";
import React from "react";
import { SheetForm } from "./SheetForm";

interface SheetViewProps {
  activeSheet: string | null;
}

// Gets the actor for rendering a character sheet
const GET_ACTOR_SHEET = gql`
  query GetMyCharacterSheet($id: String!) {
    actorSheet(id: $id, include: { ruleset: true }) {
      id, 
      name,
      layout,
      styling,
      rawStyling,
      ruleset {
        id,
        name,
        rules
      }
    }
  }
`;

export function SheetView(props: SheetViewProps) {
  const [ getSheet, { data, loading, error }] = useLazyQuery(GET_ACTOR_SHEET);

  // Handles the changing actor, allowing the sheet to update
  React.useEffect(() => {
    if (props.activeSheet === null) { return; }

    getSheet({ variables: { id: props.activeSheet } });
    const previousSheet = props.activeSheet;

    return () => {
      ActorController.endRender(previousSheet);
    };
  }, [props.activeSheet]);

  // Loads and creates the render
  React.useEffect(() => {
    if (loading || error || !data || props.activeSheet === null) { return; }
    ActorController.loadRuleset(data.actorSheet.ruleset.id, data.actorSheet.ruleset);
    ActorController.loadSheet(data.actorSheet.id, data.actorSheet);

    ActorController.newRender(
      null,
      data.actorSheet.ruleset.id,
      data.actorSheet.id,
      props.activeSheet
    );
  });

  if (props.activeSheet === null) {
    return <>Select a character sheet</>;
  }

  if (loading || data === undefined) { return <>Loading</>; }
  if (error) { return <>Error! {error}</>; }

  return <><SheetForm sheet={data.actorSheet}/></>;
}
