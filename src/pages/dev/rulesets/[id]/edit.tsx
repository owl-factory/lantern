import React from "react";
import { Page } from "components/design";
import { useRouter } from "next/router";
import { RulesetForm } from "components/reroll/rulesets/Form";
import Link from "next/link";
import { Button } from "@owl-factory/components/button";
import { NextPageContext } from "next";
import { getRuleset } from "src/pages/api/dev/rulesets/[id]";
import { Ruleset } from "@prisma/client";

interface EditRulesetProps {
  ruleset: Ruleset | null
}

/**
 * Renders a development page for editing a ruleset
 */
function EditRuleset(props: EditRulesetProps) {
  const router = useRouter();
  if (!props.ruleset) {
    router.push("/404");
    return;
  }

  /**
   * Handles redirecting the user after the submission
   */
  function postSubmit() {
    router.push("/dev/rulesets");
  }

  return (
    <Page>
      <h1>Edit Ruleset {props.ruleset.name}</h1>
      <Link href="/dev/rulesets"><Button>Back</Button></Link>
      <RulesetForm
        submitTo={`/api/dev/rulesets/${props.ruleset.id}`}
        ruleset={props.ruleset}
        postSubmit={postSubmit}
      />
    </Page>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const ruleset = await getRuleset(ctx.query.id as string);

  return { props: { ruleset } };
}

export default EditRuleset;
