import {
  Card,
  CardContent,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  // TextField,
  Typography
} from "@material-ui/core";
import { TextField } from "../components/common/forms/inputs"
import React from "react";
import Page from "../components/Page";

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

function BugReportForm(props: any) {
  const [data, setData] = React.useState({
    email: "",
    bugType: "",
    message: "",
  });

  return (
    <Grid container>
      <TextField
        label="Email"
        name="email"
        required={true}
        variant="filled"
      />

      <Grid item sm={6} xs={12}>
        <InputLabel id="bug-type-label">Bug Type</InputLabel>
        <Select
          labelId="bug-type-label"
          id="bug-type"
          required={true}
          value={data.bugType}
          onChange={(e) => {}}
        >
          <MenuItem value="render-issue">Render Issue</MenuItem>
          <MenuItem value="loss-of-data">Loss of Data</MenuItem>
        </Select>
      </Grid>

      <TextField
        color="primary"
        label="What Happened?"
        required={true}
        multiline
        rows="5"
      />
    </Grid>
  );
}

export default BugReport;
