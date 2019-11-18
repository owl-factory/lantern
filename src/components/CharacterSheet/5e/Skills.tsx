import { Checkbox } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Skills(props: any) {
  /**
   * Handles the update event when the user changes the input
   */
  const handleChange = (name: any) => (event: any) => {
    // context.updateCharacter(name, event.target.value);
  };

  function skill(index: number) {

    const skillName = context.rules.skillNames[index];

    return (
      <div>
        <Checkbox
          id={skillName + "_saving"}
          checked={context.character.skillProficiencies[index]}
        // onChange={handleChange(modifierLower + "_saving")}
        // value={!props.character[modifierLower + "_saving"]}
        />
        {skillName}&nbsp;
        ({context.rules.attributeAbbreviations[context.rules.skillAttributes[index]]})&nbsp;
        {context.character.skillModifiers[index]}
      </div>
    );
  }

  const skills: JSX.Element[] = [];
  const context = useContext(CharacterSheetContext);

  context.rules.skillDisplayOrder.forEach((index: number) => {
    skills.push(skill(index));
  });

  return <div>{skills}</div>;
}

export default Skills;
