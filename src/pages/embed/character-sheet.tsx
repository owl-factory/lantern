import { Actor, ActorSheet } from "@prisma/client";
import { gql } from "apollo-server-micro";
import ClientOnly from "components/ClientOnly";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { Mediator } from "nodes/mediator";
import { RenderSources, ViewRender, ViewRenderer, ViewType } from "nodes/view-renderer";
import React, { ChangeEvent } from "react";
import { apolloClient } from "src/graphql/apollo-client";

const EMPTY_ID = "_demo-actor";

// Query to fetch the demo actor sheet
const FETCH_DEMO_ACTOR_SHEET = gql`
  query DemoActorSheet($id: String!) {
    actorSheet(id: $id) {
      id, name, layout, styling, rulesetID,
      ruleset {
        id, name, rules
      }
    }
  }
`;

/**
 * Fetches a collection of supplied actors
 * @param actorIDs The list of ID
 * @returns The results of fetching information
 */
async function fetchActors(actorIDs: string[]) {
  let fetchActorString = "";
  let index = 0;
  for (const actorID of actorIDs) {
    fetchActorString += `
      actor_${index++}: actor(id: "${actorID}") {
        id, name, actorSheetID, rulesetID,
        actorSheet {
          id, name, layout, styling
        },
        ruleset {
          id, name, rules
        }
      }
    `;
  }

  const fetchActorsGQL = gql`
    query DemoFetchActors {
      ${fetchActorString}
    }
  `;

  return await apolloClient.query({ query: fetchActorsGQL });
}

interface DemoCharacterListProps {
  actors: Record<string, Actor>;
  setActiveCharacter: (actorID: string) => void;
}

/**
 * Renders a list of characters for selecting one
 * @param actors The list of actors to draw from
 * @param setActiveCharacter A function to set the active character
 */
function DemoCharacterList(props: DemoCharacterListProps) {

  const options: JSX.Element[] = [];
  options.push(<option key="empty_option" value={EMPTY_ID}>Demo 5e Character Sheet</option>);

  for (const key of Object.keys(props.actors)) {
    if (key === EMPTY_ID) { continue; }
    const actor = props.actors[key];
    options.push(<option key={`actor_option_${actor.id}`} value={actor.id}>{actor.name}</option>);
  }

  function onChange(ev: ChangeEvent<HTMLSelectElement>) {
    props.setActiveCharacter(ev.target.value);
  }

  return (
    <select name="actorID" onChange={onChange}>
      {options}
    </select>
  );
}

interface DemoCharacterSheetProps {
  actor: Actor | undefined;
}

/**
 * Renders an actor sheet for demonstration purposes
 * @param actor The actor to render the actor sheet for
 */
const DemoCharacterSheet = observer((props: DemoCharacterSheetProps) => {
  const [actorSheet, setActorSheet] = React.useState<ActorSheet | undefined>();

  React.useEffect(() => {
    if (!props.actor) { return; }

    apolloClient.query({ query: FETCH_DEMO_ACTOR_SHEET, variables: { id: props.actor.actorSheetID } }).then((res) => {
      if (!res || !res.data || !res.data.actorSheet) { return; }
      setActorSheet(res.data.actorSheet);
      const sheet = res.data.actorSheet;
      ViewRenderer.import(sheet.id, ViewType.ActorSheet, { xml: sheet.layout, css: sheet.styling });
      ActiveData.refreshRuleset(sheet.rulesetID);

    });
    ActiveData.refreshActor(props.actor.id);

  }, [props.actor]);

  if (!props.actor || !actorSheet) { return <></>; }

  const sources: RenderSources = {
    actorID: props.actor.id,
    rulesetID: actorSheet.rulesetID,
  };

  return (
    <ViewRender viewID={actorSheet.id} sources={sources}/>
  );
});

interface EmbedCharacterSheetProps {
  actorSheetID: string | undefined;
  actorIDs: string[];
}

/**
 * Creates an embeddable endpoint for use with iframes
 * @param actorSheetID The default actor sheet to use for an empty demo sheet
 * @param actors Any pre-existing actors who can be used to demo the actor sheets
 * @returns An embeddable page containing a select input and a character sheet
 */
function EmbedCharacterSheet(props: EmbedCharacterSheetProps) {
  const defaultActor = {
    id: EMPTY_ID,
    name: "Demo 5e Character Sheet",
    fields: {},
    content: {},
    actorSheetID: props.actorSheetID || "",
  } as Actor;
  const [ actors, setActors ] = React.useState<Record<string, Actor>>({ [EMPTY_ID]: defaultActor });
  const [ activeActor, setActiveActor ] = React.useState(EMPTY_ID);

  React.useEffect(() => {
    const fetchedActors: Record<string, Actor> = {};
    fetchedActors[EMPTY_ID] = defaultActor;

    Mediator.set(ActorSheetMediatorHandler);

    if (props.actorIDs.length === 0) {
      setActors(fetchedActors);
      return () => { Mediator.reset(); };
  }

    fetchActors(props.actorIDs).then((res) => {
      const keys = Object.keys(res.data);

      for (const key of keys) {
        const actor = res.data[key];
        fetchedActors[actor.id] = actor;
      }
      setActors(fetchedActors);
    });
    return () => { Mediator.reset(); };
  }, []);

  if (!props.actorSheetID) { return <>No Character Sheet has been set by the developer</>; }


  return (
    <>
      <ClientOnly>
        <DemoCharacterList actors={actors} setActiveCharacter={setActiveActor}/>
      </ClientOnly>
        <DemoCharacterSheet actor={actors[activeActor]}/>
    </>
  );
}

export default observer(EmbedCharacterSheet);

/**
 * Grabs some environment variables for different actors and actor sheets for different environments
 */
export function getServerSideProps() {
  const actorIDs = (process.env.DEMO_CHARACTERS ? process.env.DEMO_CHARACTERS.split(",") : []);
  return {
    props: {
      actorSheetID: process.env.DEMO_CHARACTER_SHEET_ID || "",
      actorIDs,
    },
  };
}
