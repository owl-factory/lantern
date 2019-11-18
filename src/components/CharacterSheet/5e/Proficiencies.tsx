import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Proficiencies(props: any) {
  function renderProficiencyRow(index: number): JSX.Element {
    return (
      <div>
        {context.character.proficiencyNames[index]}&nbsp;
        {context.rules.proficiencyTypes[context.character.proficiencyTypes[index]]}
      </div>
    );
  }

  const proficiencyRows: JSX.Element[] = [];
  const context = useContext(CharacterSheetContext);

  context.character.proficiencyDisplayOrder.forEach((index: number) => {
    proficiencyRows.push(renderProficiencyRow(index));
  });

  return (
    <div>
      {proficiencyRows}
      Other Proficiencies &amp; Languages
    </div>
  );
}

export default Proficiencies;
