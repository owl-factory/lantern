import { Page } from "components/design";
import { ContentTypeForm } from "components/reroll/contentTypes/Form";
import React from "react";


export default function NewContentType() {
  return (
    <Page>
      <h1>New Content Type</h1>
      <ContentTypeForm/>
    </Page>
  );
}
