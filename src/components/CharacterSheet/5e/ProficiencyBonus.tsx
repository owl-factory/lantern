import { TextField, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

/**
 * Renders the inspiration section.
 * @param props
 */
function ProficiencyBonus(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <TextField
        value={context.character.proficiency}
      />
      Proficiency
    </Typography>
  );
}

export default ProficiencyBonus;
