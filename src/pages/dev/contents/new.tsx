import React from "react";
import { Page } from "components/design";
import { ContentForm } from "components/reroll/contents/Form";


export default function NewContentType() {
  return (
    <Page>
      <h1>New Content</h1>
      <ContentForm/>
    </Page>
  );
}
