import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Traits(props: any) {
  function renderTraitRow(index: number) {
    return (
      <div>
        <div>{context.character.traits[index]}</div>
        {context.rules.characterTraits[index]}
      </div>
    );
  }

  const context = useContext(CharacterSheetContext);
  const traitRows: JSX.Element[] = [];

  context.rules.characterTraitDisplayOrder.forEach((index: number) => {
    traitRows.push(renderTraitRow(index));
  });

  return <Typography>{traitRows}</Typography>;
}

export default Traits;
