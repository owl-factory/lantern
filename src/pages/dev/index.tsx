import { Page } from "components/design";
import Link from "next/link";
import React from "react";

/**
 * An index page listing out all of the development pages for easier navigation
 */
export default function DevIndex() {
  return (
    <Page>
      <h1>Index</h1>
      <h2>Rulesets</h2>
      <Link href="/dev/rulesets">List Rulesets</Link><br/>
      <Link href="/dev/rulesets/new">Create Ruleset</Link><br/>
      <br/>

      <h2>Modules</h2>
      <Link href="/dev/modules">List Modules</Link><br/>
      <Link href="/dev/modules/new">Create Module</Link><br/>
      <br/>

      <h2>Actor Sheets</h2>
      <Link href="/dev/actor-sheets">List Actor Sheets</Link><br/>
      <br/>

      <h2>Actors</h2>
      <Link href="/dev/actors">List Actors</Link><br/>
      <br/>

      <h2>Content Types</h2>
      <Link href="/dev/content-types">List Content Types</Link><br/>
      <Link href="/dev/content-types/new">Create Content Types</Link><br/>
      <br/>

      <h2>Contents</h2>
      <Link href="/dev/contents">List Contents</Link><br/>
      <Link href="/dev/contents/new">Create Contents</Link><br/>
      <br/>

      <h2>Files</h2>
      <Link href="/dev/file-upload">Upload File</Link><br/>
    </Page>
  );
}
