import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@owl-factory/components/button";
import { ContentTypeForm } from "components/reroll/contentTypes/Form";
import { toJS } from "mobx";
import { ContentType } from "@prisma/client";

/**
 * Renders a development page for editing a content type
 */
const EditContentType = observer(() => {
  const router = useRouter();
  const ref = router.query.ref as string;

  // Unlinks from MobX
  const contentType = {} as ContentType;

  return (
    <Page>
      <h1>Edit Content Type {contentType?.name}</h1>
      <Link href="/dev/content-types"><Button>Back</Button></Link>
      {/* Ensures that the form isn't rendered until after the document is loaded in */}
      { contentType ? <ContentTypeForm contentType={contentType}/> : undefined }
    </Page>
  );
});

export default EditContentType;
