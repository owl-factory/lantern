import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";
import { Actor } from "@prisma/client";
import { gql } from "apollo-server-micro";
import ClientOnly from "components/ClientOnly";
import { ActorView } from "components/pages/characters";
import { ActorSheetMediatorHandler } from "controllers/mediators/ActorSheetHandler";
import { observer } from "mobx-react-lite";
import { Mediator } from "nodes/mediator";
import React, { ChangeEvent } from "react";
import { apolloClient } from "src/graphql/apollo-client";


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
  actorIDs: string[];
  setActiveCharacter: (actorID: string) => void;
}

/**
 * Renders a list of characters for selecting one
 * @param actors The list of actors to draw from
 * @param setActiveCharacter A function to set the active character
 */
function DemoCharacterList(props: DemoCharacterListProps) {
  const options: JSX.Element[] = [];

  for (const actorID of props.actorIDs) {
    const actor = props.actors[actorID];
    if (!actor) continue;
    options.push(<option key={`actor_option_${actorID}`} value={actorID}>{actor.name}</option>);
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

interface EmbedCharacterSheetProps {
  actorIDs: string[];
}

/**
 * Creates an embeddable endpoint for use with iframes
 * @param actorSheetID The default actor sheet to use for an empty demo sheet
 * @param actors Any pre-existing actors who can be used to demo the actor sheets
 * @returns An embeddable page containing a select input and a character sheet
 */
function EmbedCharacterSheet(props: EmbedCharacterSheetProps) {
  if (!props.actorIDs || props.actorIDs.length === 0) { return <></>; }
  const [actors, setActors] = React.useState<Record<string, Actor>>({});
  const [ activeActor, setActiveActor ] = React.useState(props.actorIDs[0]);
  const [ isError, setIsError ] = React.useState(false);

  React.useEffect(() => {
    const fetchedActors: Record<string, Actor> = {};

    Mediator.set(ActorSheetMediatorHandler);

    if (props.actorIDs.length === 0) {
      setActors(fetchedActors);
      return () => { Mediator.reset(); };
    }

    for(const actorID of props.actorIDs) {
      // TODO - lock ActiveData
    }

    fetchActors(props.actorIDs).then((res) => {
      const keys = Object.keys(res.data);

      for (const key of keys) {
        const actor = res.data[key];
        fetchedActors[actor.id] = actor;
      }
      setActors(fetchedActors);
    }).catch((err) => {
      setIsError(true);
    });
    return () => { Mediator.reset(); };
  }, []);

  if (isError) {
    return (
      <Alert status="error">
        <AlertIcon/>
        <AlertDescription>An error occured while loading character sheets.</AlertDescription>
      </Alert>
      );
  }

  return (
    <>
      <ClientOnly>
        <DemoCharacterList actorIDs={props.actorIDs} actors={actors} setActiveCharacter={setActiveActor}/>
      </ClientOnly>
      <ClientOnly>
        <ActorView activeActor={activeActor} />
      </ClientOnly>
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
      actorIDs,
    },
  };
}
