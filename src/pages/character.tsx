import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { CharacterSheet as CharacterSheet5e } from "../components/CharacterSheet/5e/CharacterSheet";
import { characterData, ruleData, sheetLayoutData } from "../components/CharacterSheet/5e/Data";
import { CharacterSheetContext } from "../components/CharacterSheet/Context";
import Page from "../components/Page";

function Character() {
  // Build Styling
  const useStyles = makeStyles((theme: Theme) => ({
    module: {
      padding: "1em",
      marginBottom: "1em",

      borderStyle: "solid",
      borderWidth: 2,
      borderColor: "white",
    },
  }));

  // Fetch character sheet from DB
  const [character, setCharacter] = React.useState(characterData);

  // This is set in a different state pair so that we can avoid rebuilding
  // everything when a single value changes
  const [sheetLayout, setSheetLayout] = React.useState(sheetLayoutData);

  // Fetch ruleset
  const rules = ruleData;

  // Determine rule set for the character
  const ruleSet: string = character.ruleSet;

  // Build data for the Character Sheet Context
  const ContextData = {
    character,
    setCharacter,
    sheetLayout,
    setSheetLayout,
    rules,
    classes: useStyles(),
  };

  // Determines the Character Sheet to use based on the ruleset used
  let sheetElement: JSX.Element;
  switch (ruleSet) {
    case "5e":
      sheetElement = <CharacterSheet5e />;
      break;
    default: sheetElement = <div>No Ruleset Selected</div>
  }

  return (
    <Page>
      <CharacterSheetContext.Provider value={ContextData}>
        {sheetElement}
      </CharacterSheetContext.Provider>
    </Page>
  );
}

export default Character;
