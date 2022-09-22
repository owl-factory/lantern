import { Button } from "@chakra-ui/react";
import { Page } from "components/design";
import { ContentTypeForm } from "components/reroll/contentTypes/Form";
import Link from "next/link";
import React from "react";

/**
 * Renders a form for creating a new content type
 */
export default function NewContentType() {
  return (
    <Page>
      <h1>New Content Type</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ContentTypeForm/>
    </Page>
  );
}
