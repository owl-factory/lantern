import { Button } from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { rest } from "@owl-factory/https";
import { Ruleset } from "@prisma/client";
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
   * Creates a ruleset
   * @param values The values from the form for the ruleset to create
   * @returns The result from the ruleset creation
   */
  async function onSubmit(values: Partial<Ruleset>) {
    const result = await rest.put<{ ruleset: Ruleset }>(`/api/dev/rulesets`, { ruleset: values });
    if (result.success) {
      AlertController.success(`${result.data.ruleset.name} was successfully created!`);
      router.push(`/dev/rulesets/${result.data.ruleset.id}`);
      return result;
    }

    AlertController.error(`${result.data.ruleset.name} could not be successfully created.`);
    return result;
  }

  return (
    <Page>
      <h1>New Ruleset</h1>
      <Link href="/dev/rulesets"><Button>Back</Button></Link>
      <RulesetForm onSubmit={onSubmit}/>
    </Page>
  );
}
