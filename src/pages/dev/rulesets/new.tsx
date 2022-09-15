import { Button } from "@chakra-ui/react";
import { Page } from "components/design";
import { RulesetForm } from "components/reroll/rulesets/Form";
import Link from "next/link";
import React from "react";

/**
 * Renders a page for testing new ruleset creation
 */
export default function NewRuleset() {
  return (
    <Page>
      <h1>New Ruleset</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <RulesetForm/>
    </Page>
  );
}
