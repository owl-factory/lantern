import { Page } from "components/design";
import Link from "next/link";
import React from "react";

export default function DevIndex() {
  return (
    <Page>
      <h1>Index</h1>
      <h2>Rulesets</h2>
      <Link href="/dev/rulesets">List Rulesets</Link><br/>
      <Link href="/dev/rulesets/new">Create Ruleset</Link><br/>
      <br/>

      <h2>Files</h2>
      <Link href="/dev/file-upload">Upload File</Link><br/>
    </Page>
  );
}
