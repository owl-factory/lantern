import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { RulesetForm } from "components/reroll/rulesets/Form";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

/**
 * Renders a page for testing new ruleset creation
 */
export default function NewRuleset() {
  const router = useRouter();

  /**
   * Handles redirecting the user after the submission
   */
  function postSubmit() {
    router.push("/dev/rulesets");
  }

  return (
    <Page>
      <h1>New Ruleset</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <RulesetForm submitTo="/api/dev/rulesets" postSubmit={postSubmit}/>
    </Page>
  );
}
