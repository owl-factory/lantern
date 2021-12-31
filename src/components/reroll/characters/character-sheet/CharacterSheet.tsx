import { PassiveReadLevel } from "@owl-factory/cache/enums";
import { Ref64 } from "@owl-factory/types";
import { Button, Loading } from "components/style";
import { Input } from "components/style/forms";
import { CharacterCache } from "controllers/cache/CharacterCache";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { CharacterDocument } from "types/documents";

interface CharacterSheetProps {
  activeCharacter: Ref64 | undefined;
}

/**
 * Renders a character sheet for a given user
 * @param activeCharacter The ref for the current character to display in the character sheet
 * @returns An interactive character sheet
 */
function CharacterSheetTSX(props: CharacterSheetProps) {
  const [ character, setCharacter ] = React.useState<Partial<CharacterDocument> | undefined>(undefined);

  function onSubmit(values: { character: Partial<CharacterDocument> }) {
    CharacterCache.update(character?.ref as string, values.character);
  }

  // Loads the active character
  React.useEffect(() => {
    const cachedCharacter = CharacterCache.get(props.activeCharacter, PassiveReadLevel.IfUnloaded);
    setCharacter(cachedCharacter);
  }, [props.activeCharacter, CharacterCache.lastTouched]);

  // Base case for no character loaded.
  if (character === undefined) { return <div>No Character Loaded</div>; }
  if (props.activeCharacter !== character.ref) { return <div></div>; }

  return (
    <div>
      <Formik
        initialValues={{character: character}}
        onSubmit={onSubmit}
      >
        <Form>
          <Input type="text" name="character.name"/>
          <Button type="submit">Save</Button>
        </Form>
      </Formik>
    </div>
  );
}

export const CharacterSheet = observer(CharacterSheetTSX);
