import { Checkbox, TextField, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

/**
 * Renders the inspiration section.
 * @param props
 */
function SavingThrows(props: any) {
  /**
   * Handles the update event when the user changes the input
   */
  const handleChange = (index: number) => (event: any) => {
    const savingThrowProficiencies = props.character.savingThrowProficiencies;
    savingThrowProficiencies[index] = !savingThrowProficiencies[index];
    props.updateCharacter(name, event.target.value);
  };

  /**
   * Renders a single instance of a saving throw row, including the name,
   * modifier, and whether or not it is proficient
   *
   * @param index - the index of the saving throw to render
   *
   * Returns a JSX.Element containing the saving throw row
   */
  function renderSavingThrow(index: number) {
    const throwAbbreviation = context.rules.attributeAbbreviations[index];
    const throwName = context.rules.attributeNames[index];

    const checked = context.character.savingThrowProficiencies[index];

    return (
      <div>
        <Checkbox
          id={throwAbbreviation + "_saving"}
          checked={checked}
          onChange={handleChange(index)}
        />
        {context.character.savingThrowModifiers[index]}&nbsp;
        {throwName}
      </div>
    );
  }
  const context = useContext(CharacterSheetContext);
  const savingThrowRows: JSX.Element[] = [];

  context.rules.savingThrowDisplayOrder.forEach((savingThrowIndex: number) => {
    savingThrowRows.push(renderSavingThrow(savingThrowIndex));
  });

  return <Typography>{savingThrowRows}</Typography>;
}

export default SavingThrows;
