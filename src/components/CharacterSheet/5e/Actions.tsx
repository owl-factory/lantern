import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Actions(props: any) {
  function renderActionRow(index: number) {
    return (
      <Typography>
        <span>Firebolt</span>&nbsp;
        <span>+5</span>&nbsp;
        <span>3d6 Fire</span>
      </Typography>
    );
  }

  const actionRows: JSX.Element[] = [renderActionRow(1)];
  const context = useContext(CharacterSheetContext);

  return <Typography>{actionRows}Actions &amp; Spellcasting</Typography>;
}

export default Actions;
