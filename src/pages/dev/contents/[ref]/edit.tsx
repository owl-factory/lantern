import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@owl-factory/components/button";
import { ContentForm } from "components/reroll/contents/Form";
import { Content } from "@prisma/client";

/**
 * Renders a development page for editing a content
 */
const EditContent = observer(() => {
  const router = useRouter();
  const ref = router.query.ref as string;

  const content = {} as Content;

  return (
    <Page>
      <h1>Edit Content {content?.name}</h1>
      <Link href="/dev/contents"><Button>Back</Button></Link>
      {/* Ensures that the form isn't rendered until after the document is loaded in */}
      { content ? <ContentForm content={content}/> : undefined }
    </Page>
  );
});

export default EditContent;
