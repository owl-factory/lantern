import { gql, useMutation } from "@apollo/client";
import { Box, Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import React from "react";
import { Scalar } from "types";
import { ActorController } from "../controllers/ActorSheetController";
import { SheetProperties } from "../types";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  id: string;
  onSubmit?: (values: Record<string, Scalar>) => void;
}

const MUTATE_ACTOR = gql`
  mutation MutateActorFieldsAndContent($id: String!, $actor: ActorMutateInput!) {
    mutateActor(id: $id, actor: $actor) {
      id, name, fields, content
    }
  }
`;

/**
 * Renders an actor sheet
 * @param id The ref or temporary key of a sheet to load
 */
export const ActorSheetComponent = observer((props: ActorSheetProps) => {
  const [ saveActor, { data } ] = useMutation(MUTATE_ACTOR);

  const sheet = ActorController.getSheet(props.id);
  const properties: SheetProperties = {
    $prefix: props.id,
    $source: {},
    $index: {},
  };

  // Renders each of the children of the base sheet
  const sheetElements: JSX.Element[] = [];
  for(const childElement of sheet.children || []) {
    sheetElements.push(
      <SheetElement
        key={props.id + childElement.$key}
        $key={props.id + childElement.$key}
        renderID={props.id}
        element={childElement}
        properties={properties}
      />
    );
  }

  /**
   * Takes the actor values and saves them into the appropriate actor
   */
  function save() {
    const actor = ActorController.exportActor(props.id);
    saveActor({ variables: { id: props.id, actor: { fields: actor.fields, content: actor.content } }});
  }

  const sheetID = ActorController.$renders[props.id]?.sheetID || "";

  return (
    <>
      <Button type="button" onClick={save}>Save</Button>
      <Box className={`actor-sheet-wrapper actor-sheet-${sheetID}`}>
        <Box className="actor-sheet">
          {sheetElements}
        </Box>
      </Box>
    </>
  );
});

