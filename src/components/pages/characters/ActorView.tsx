import { gql, useLazyQuery } from "@apollo/client";
import { ActiveData } from "nodes/active-data";
import { ViewRender, ViewRenderer, ViewType } from "nodes/view-renderer";
import { RenderSources } from "nodes/view-renderer/types/render";
import React from "react";

interface ActorViewProps {
  activeActor: string | undefined;
}

// Gets the actor for rendering a character sheet
const GET_ACTOR = gql`
  query GetMyCharacter($id: String!) {
    actor(id: $id, include: { actorSheet: true, ruleset: true }) {
      id, 
      name,
      fields,
      content,
      actorSheet {
        id,
        name,
        layout,
        styling
      },
      campaignID,
      ruleset {
        id,
        name,
        rules
      }
    }
  }
`;

/**
 * Renders an actor sheet for the given actor
 * @param props.activeActor The ID of the current actor to render. May be undefined
 * @returns The ViewRender element of the given actor
 */
export function ActorView(props: ActorViewProps) {
  const [ getActor, { data, loading, error }] = useLazyQuery(GET_ACTOR);

  // Handles the changing actor, allowing the sheet to update
  React.useEffect(() => {
    if (props.activeActor === undefined) { return; }

    getActor({ variables: { id: props.activeActor } });
  }, [props.activeActor]);

  // Loads and creates the render
  React.useEffect(() => {
    if (loading || error || !data || props.activeActor === undefined) { return; }
    ActiveData.refreshActor(data.actor.id);
    ActiveData.refreshRuleset(data.actor.ruleset.id);
    ViewRenderer.import(
      data.actor.actorSheet.id,
      ViewType.ActorSheet,
      { xml: data.actor.actorSheet.layout, css: data.actor.actorSheet.styling }
    );
  });

  if (props.activeActor === undefined) {
    return <>Select a character</>;
  }

  if (loading || data === undefined) { return <>Loading</>; }
  if (error) { return <>Error! {error}</>; }

  const sources: RenderSources = {
    actorID: data.actor.id,
    campaignID: data.actor.campaignID,
    rulesetID: data.actor.rulesetID,
    sheetID: data.actor.actorSheet.id,
  };

  return <><ViewRender viewID={data.actor.actorSheet.id} sources={sources}/></>;
}
