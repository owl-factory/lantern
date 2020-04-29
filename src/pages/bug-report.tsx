import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import {Form, Input, Select, TextArea} from "../components/design/Forms";
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
  const bugOptions = [
    {name: "Render Issue", value: "Render Issue"},
    {name: "Loss of data", value: "Loss of Data"},
  ];

  return (
    <Form>
      <Input id="email" label="Email" name="Email"/>
      <Select id="bugType" label="Bug Type" name="Bug Type" data={bugOptions} labelKey="name"/>
      <TextArea id="message" label="What Happened?" name="What Happened?"/>
    </Form>
  );
}

export default BugReport;
