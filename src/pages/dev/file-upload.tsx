import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { FileUploadForm } from "components/reroll/files/FileUploadForm";
import Link from "next/link";
import React from "react";

/**
 * Renders a development page for testing the File Upload form
 */
export default function FileUploadPage() {
  return (
    <Page>
      <h1>Upload a File</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <FileUploadForm/>
    </Page>
  );
}
