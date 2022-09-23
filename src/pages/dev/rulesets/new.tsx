import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { rest } from "@owl-factory/https";
import { Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { RulesetForm } from "components/reroll/rulesets/Form";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const CREATE_RULESET = gql`
  mutation CreateRulesetByDev($ruleset: RulesetInput!) {
    createRuleset(ruleset: $ruleset) {
      name,
      alias
    }
  }
`;



/**
 * Renders a page for testing new ruleset creation
 */
export default function NewRuleset() {
  const router = useRouter();
  const [ createRuleset, { data } ] = useMutation(CREATE_RULESET);

  function onCompleted(createdData: unknown) {
    console.log(createdData);
  
  }
  
  function onError(error: ApolloError) {
    console.error("BAD", error)
  }

  /**
   * Creates a ruleset
   * @param values The values from the form for the ruleset to create
   * @returns The result from the ruleset creation
   */
  async function onSubmit(values: Partial<Ruleset>) {
    console.log(values)
    await createRuleset({
      variables: { ruleset: values },
      onCompleted,
      onError,
    });

    // const result = await rest.put<{ ruleset: Ruleset }>(`/api/dev/rulesets`, { ruleset: values });
    // if (result.success) {
    //   AlertController.success(`${result.data.ruleset.name} was successfully created!`);
    //   router.push(`/dev/rulesets/${result.data.ruleset.id}`);
    //   return result;
    // }

    // AlertController.error(`${result.data.ruleset.name} could not be successfully created.`);
    return data;
  }

  return (
    <Page>
      <h1>New Ruleset</h1>
      <Link href="/dev/rulesets"><Button>Back</Button></Link>
      <RulesetForm onSubmit={onSubmit}/>
    </Page>
  );
}
