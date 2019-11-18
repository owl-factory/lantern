import { Grid, TextField } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Header(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <TextField value={context.character.name} />
      </Grid>

      <Grid item>
        Other Stuff
      </Grid>
    </Grid>
  );
}

export default Header;
