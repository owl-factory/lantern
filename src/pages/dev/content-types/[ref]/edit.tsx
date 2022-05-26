import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@owl-factory/components/button";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { ContentTypeForm } from "components/reroll/contentTypes/Form";

/**
 * Renders a development page for editing a content type
 */
const EditContentType = observer(() => {
  const router = useRouter();
  const ref = router.query.ref as string;

  // Ensures that the content type is fully loaded, if it isn't already
  React.useEffect(() => {
    ContentTypeData.load(ref);
  }, [ref]);
  const contentType = ContentTypeData.get(ref);

  return (
    <Page>
      <h1>Edit Content Type {contentType?.name}</h1>
      <Link href="/dev/content-types"><Button>Back</Button></Link>
      {/* Ensures that the form isn't rendered until after the document is loaded in */}
      { contentType && ContentTypeData.isLoaded(ref) ? <ContentTypeForm contentType={contentType}/> : undefined }
    </Page>
  );
});

export default EditContentType;
