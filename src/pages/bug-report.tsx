import { Card, CardContent, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core";
import React from "react";
import Page from "../components/Page";

function BugReport() {
  const [data, setData] = React.useState({
    email: "",
    bugType: "",
    message: "",
  });

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

          <form>
            <TextField color="primary" label="Email" name="email" required={true}/>
            <InputLabel id="bug-type-label">Bug Type</InputLabel>
            <Select
              labelId="bug-type-label"
              id="bug-type"
              required={true}
              value={data.bugType}
              onChange={() => {}}
            >
              <MenuItem value="">Render Issue</MenuItem>
              <MenuItem value="">Loss of Data</MenuItem>
            </Select>
          </form>
        </CardContent>
      </Card>
    </Page>
  );
}

export default BugReport;
