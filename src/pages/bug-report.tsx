import React from "react";
import {AutoForm, Input, Select, TextArea} from "../components/design/forms/Forms";
import Page from "../components/design/Page";
import { Card } from "react-bootstrap";

/**
 * Renders the Bug Report page
 */
function BugReport() {
  return (
    <Page>
      <Card>
        <Card.Body>
          <h4>
            Report a Bug
          </h4>

          <p>
            Something break? Encounter an error? Let us know!
          </p>

          <BugReportForm/>
        </Card.Body>
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
    <AutoForm>
      <Input id="email" label="Email" name="Email"/>
      <Select id="bugType" label="Bug Type" name="Bug Type" options={bugOptions} labelKey="name"/>
      <TextArea id="message" label="What Happened?" name="What Happened?"/>
    </AutoForm>
  );
}

export default BugReport;
