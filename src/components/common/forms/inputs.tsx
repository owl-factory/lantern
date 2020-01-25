/**
 * Contains standardized versions of the form inputs so that we can avoid 
 * differing styles throughout the site
 */

import { Grid, TextField as MuiTextField } from "@material-ui/core";

export function TextField(props: any) {
  let smallSize: 6 | 12 = 6;
  if (props.fullWidth === true) {
    smallSize = 12;
  }

  console.log(props)

  return (
    <Grid item sm={smallSize} xs={12}>
      <MuiTextField
        label={props.label}
        value={props.value}
        required={props.required} // TODO - check behavior of undefined; we may have
                                  // to create default values
        variant="filled"
        color="primary"
        fullWidth
        multiline={props.multiline}
        rows={props.rows}
      />
    </Grid>
  );
}
