import { TextField, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

/**
 * Renders the inspiration section.
 * @param props
 */
function Inspiration(props: any) {

  /**
   * Handles the update event when the user changes the input
   */
  const handleChange = (name: any) => (event: any) => {
    props.updateCharacter(name, event.target.value);
  };

  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <TextField
        type="number"
        value={context.character.inspiration}
        onChange={handleChange("inspiration")
        } />
      Inspiration
    </Typography>
  );
}

export default Inspiration;
