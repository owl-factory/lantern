import React from "react";
import { Page } from "components/design";
import { useRouter } from "next/router";
import { RulesetForm } from "components/reroll/rulesets/Form";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { Ruleset } from "@prisma/client";
import { rest } from "@owl-factory/https";
import { AlertController } from "@owl-factory/alerts";
import { NextPageContext } from "next";
import { getRuleset } from "src/pages/api/dev/rulesets/[id]";

interface EditRulesetProps {
  ruleset?: Ruleset;
}

/**
 * Renders a development page for editing a ruleset
 */
function EditRuleset(props: EditRulesetProps) {
  const router = useRouter();
  if (!props.ruleset) { router.push("/404"); return <></>; }

  /**
   * Submits the form values to be saved in the backend
   * @param values The new values of the ruleset
   * @returns The result of the request to the server
   */
  async function onSubmit(values: Partial<Ruleset>) {
    const result = await rest.patch<{ ruleset: Ruleset }>(
      `/api/dev/rulesets/${props.ruleset?.id}`, { ruleset: values }
    );

    if (result.success) {
      AlertController.success(`${result.data.ruleset.name} was updated!`);
      router.push(`/dev/rulesets/${props.ruleset?.id}`);
      return result;
    }

    AlertController.error(`${values.name} could not be updated`);
    return result;
  }

  return (
    <Page>
      <h1>Edit {props.ruleset.name}</h1>
      <Link href="/dev/rulesets"><Button>Back</Button></Link>
      {/* Ensures that the Ruleset isn't rendered until after the document is loaded in */}
      <RulesetForm ruleset={props.ruleset} onSubmit={onSubmit}/>
    </Page>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const ruleset = await getRuleset(ctx.query.id as string);
  return { props: { ruleset } };
}

export default EditRuleset;
