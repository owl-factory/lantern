import React from "react";
import { Page } from "components/design";
import { ContentForm } from "components/reroll/contents/Form";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

/**
 * Renders a form for creating a new content
 */
export default function NewContentType() {
  return (
    <Page>
      <h1>New Content</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ContentForm/>
    </Page>
  );
}
