import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
// import { TextField } from "../components/common/forms/inputs";
import Page from "../components/Page";

/**
 * Renders the Bug Report page
 */
function BugReport() {
  return (
    <Page>
      <Card>
        <CardContent>
          <Typography variant="h4">
            Report a Bug
          </Typography>

          <Typography variant="body1">
            Something break? Encounter an error? Let us know!
          </Typography>

          <BugReportForm/>
        </CardContent>
      </Card>
    </Page>
  );
}

/**
 * Renders the bug report form
 */
function BugReportForm() {
  const [data, setData] = React.useState({
    email: "",
    bugType: "",
    message: "",
  });

  function updateData(event: any) {
    const newData = {...data};
    if (typeof event.target.name === "string") {
      newData[event.target.name] = event.target.value;
    }
    setData(newData);
  }

  return (
    <Grid container>
      <Grid item sm={6} xs={12}>
        <TextField
          label="Email"
          name="email"
          required={true}
          variant="filled"
          onChange={(e: any) => (updateData(e))}
          
        />
      </Grid>

      <Grid item sm={6} xs={12}>
        <FormControl>
          <InputLabel id="bug-type-label">Bug Type</InputLabel>
          <Select
            labelId="bug-type-label"
            id="bug-type"
            name="bug-type"
            required={true}
            variant="filled"
            value={data.bugType}
            onChange={(e) => {updateData(e)}}
          >
            <MenuItem value="render-issue">Render Issue</MenuItem>
            <MenuItem value="loss-of-data">Loss of Data</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <TextField
          color="primary"
          label="What Happened?"
          id="message"
          name="message"
          required={true}
          multiline
          rows="5"
        />
      </Grid>

      <Button variant="contained" type="submit" color="primary">
        Submit
      </Button>
    </Grid>
  );
}

export default BugReport;
