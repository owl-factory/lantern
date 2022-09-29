import { gql, useQuery } from "@apollo/client";
import { Box, Button, ChakraProps, useDisclosure } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Actor, ActorType, Ruleset } from "@prisma/client";
import React from "react";
import { NewActorModal } from "./NewActorModal";
import { DeleteActorAlert } from "./DeleteActorAlert";

interface CharacterListProps {
  activeActor: string | null;
  setActiveActor: (actorID: string | null) => void;
}

// The different modes used for displaying the list of characters
enum CharacterListDisplay {
  Lines,
  Tiles
}

// The include variables for each actor
const ACTOR_INCLUDE = {
  "ruleset": true,
  "actorType": true,
};

// The query to get all of a player's characters
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
  openDeleteAlert: (actor: Actor) => void;
}

/**
 * Renders an actor line for the actors list
 * @param actor The actor to render
 * @param activeActor The currently active actor
 * @param setActiveActor A function to set the active actor
 */
function ActorLine(props: ActorLineProps) {
  const activeStyling: ChakraProps = props.actor.id === props.activeActor ? {
    backgroundColor: "lightblue",
  } : {};
  return (
    <>
      <Box
        padding="12.5px"
        marginTop="5px"
        marginBottom="5px"
        paddingLeft="10px"
        {...activeStyling}
        onClick={() => {props.setActiveActor(props.actor.id); return false;}}
      >
        {props.actor.name}

        <Box float="right">
          <Button
            size="sm"
            top="-5px"
            onClick={(ev) => {ev.stopPropagation(); props.openDeleteAlert(props.actor);}}
          >
            <DeleteIcon/>
          </Button>
        </Box>
      </Box>
      <hr/>
    </>
  );
}

/**
 * Renders a list of characters
 * @param activeCharacter The ID of the active character. Null if no character is currently selected
 */
export function ActorList(props: CharacterListProps) {
  const { data, loading, error, refetch } = useQuery(GET_CHARACTERS, { variables: { include: ACTOR_INCLUDE } });
  const modal = useDisclosure();
  const deleteAlert = useDisclosure();
  const [deleteActor, setDeleteActor] = React.useState<Actor | undefined>(undefined);

  /**
   * Opens an alert to confirm the deletion of an actor
   * @param actor The actor to potentially delete
   */
  function openDeleteAlert(actor: Actor) {
    setDeleteActor(actor);
    deleteAlert.onOpen();
  }

  /**
   * Closes the alert to confirm the deletion of an actor
   */
  function closeDeleteAlert() {
    setDeleteActor(undefined);
    deleteAlert.onClose();
  }

  /**
   * Handles any functionality required for an actor that was just deleted
   * @param actor The actor that was just deleted
   */
  function onDelete(actor: Actor) {
    if (actor.id === props.activeActor) { props.setActiveActor(null); }
  }

  const actors: JSX.Element[] = [];
  if (loading) { return <>Loading</>; }
  if (error) { return <>Error! {error}</>; }

  for (const actor of data.actors) {
    actors.push(
      <ActorLine
        key={actor.id}
        actor={actor}
        activeActor={props.activeActor}
        setActiveActor={props.setActiveActor}
        openDeleteAlert={openDeleteAlert}
      />
    );
  }

  return (
    <>
      <Button onClick={modal.onOpen}>Add +</Button>
      <hr/>
      {actors}
      <NewActorModal isOpen={modal.isOpen} onClose={modal.onClose} setActiveActor={props.setActiveActor}/>
      <DeleteActorAlert
        isOpen={deleteAlert.isOpen}
        onClose={closeDeleteAlert}
        actor={deleteActor}
        onDelete={onDelete}
      />
    </>
  );
}
