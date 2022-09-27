import { gql, useQuery } from "@apollo/client";
import { Box, Button, ChakraProps, useDisclosure } from "@chakra-ui/react";
import { Actor, ActorType, Ruleset } from "@prisma/client";
import React from "react";
import { NewCharacterModal } from "./NewCharacterModal";

interface CharacterListProps {
  activeActor: string | null;
  setActiveActor: (actorID: string | null) => void;
}

enum CharacterListDisplay {
  Lines,
  Tiles
}

const ACTOR_INCLUDE = {
  "ruleset": true,
  "actorType": true,
};

const GET_CHARACTERS = gql`
  query GetMyCharacters($include: ActorInclude) {
    actors(include: $include) {
      id,
      name,
      ruleset {
        id, name
      },
      actorType {
        id, name, 
      }
    }
  }
`;

interface ActorLineProps {
  actor: Actor & { actorType: ActorType, ruleset: Ruleset };
  activeActor: string | null;
  setActiveActor: (actorID: string | null) => void
}

function ActorLine(props: ActorLineProps) {
  const activeStyling: ChakraProps = props.actor.id === props.activeActor ? {
    backgroundColor: "lightblue",
  } : {};
  return (
    <Box {...activeStyling} onClick={() => props.setActiveActor(props.actor.id)}>
      {props.actor.name}
    </Box>
  );
}

/**
 * Renders a list of characters
 * @param activeCharacter The ID of the active character. Null if no character is currently selected
 */
export function ActorList(props: CharacterListProps) {
  const { data, loading, error, refetch } = useQuery(GET_CHARACTERS, { variables: { include: ACTOR_INCLUDE } });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const actors: JSX.Element[] = [];
  if (loading) { return <>Loading</>; }
  if (error) { return <>Error! {error}</>; }

  for (const actor of data.actors) {
    actors.push(
      <ActorLine key={actor.id} actor={actor} activeActor={props.activeActor} setActiveActor={props.setActiveActor}/>
    );
  }

  return (
    <>
      <Button onClick={onOpen}>Add +</Button>
      {actors}
      <NewCharacterModal isOpen={isOpen} onClose={onClose} setActiveActor={props.setActiveActor}/>
    </>
  );
}
