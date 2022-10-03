import { Button } from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { rest } from "@owl-factory/https";
import { ActorSheet, Ruleset } from "@prisma/client";
import ClientOnly from "components/ClientOnly";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useQuery, gql } from "@apollo/client";

interface NewActorSheetResult {
  actorSheet: ActorSheet;
}

/**
 * Renders a single row for a ruleset table
 */
const RulesetRow = observer((props: { ruleset: Ruleset }) => {
  if (!props.ruleset) { return <></>; }
  const router = useRouter();

  /**
   * Creates a new actor sheet and redirects the user to the page
   */
  async function newActorSheet() {
    try {
      const result = await rest.put<NewActorSheetResult>(
        `/api/dev/actor-sheets`,
        { actorSheet: { rulesetID: props.ruleset.id } }
      );
      if (!result.success) { AlertController.error(`An actor sheet could not be created. ${result.message}`); return; }
      router.push(`/dev/actor-sheets/${result.data.actorSheet.id}`);
      AlertController.success(`An actor sheet was created for ${props.ruleset.name}`);
    } catch (e) {
      AlertController.error(`An unexpected error occurred while attempting to create an actor sheet: ${e}`);
      return;
    }
  }

  return (
    <TableRow>
      <TableCell>{props.ruleset.name}</TableCell>
      <TableCell>{props.ruleset.alias}</TableCell>
      <TableCell>
        <Link href={`/dev/rulesets/${props.ruleset.id}/edit`}>Edit</Link>
        <Link href={`/dev/rulesets/${props.ruleset.id}/new-module`}>New Module</Link>&nbsp;
        <a onClick={newActorSheet}>New Character Sheet</a>
        {/* <Link href={`/dev/rulesets/${props.ruleset.id}/new-actor-sheet`}>New Character Sheet</Link>&nbsp; */}
        {/* <a onClick={() => RulesetData.delete(ruleset.ref as string)}>Delete</a> */}
      </TableCell>
    </TableRow>
  );
});


const QUERY = gql`
  query {
    rulesets {
      id,
      name,
      alias,
    }
  }
`;

/**
 * Renders a table to list out all rulesets
 */
function RulesetTable() {
  const { data, loading, error } = useQuery(QUERY);
  const rows: JSX.Element[] = [];

  if (loading) { return <>Loading</>; }
  if (error) { console.log(error);return <>Error</>; }

  for (const ruleset of data.rulesets) {
    rows.push(<RulesetRow key={ruleset.id} ruleset={ruleset}/>);
  }

  return (
    <Table>
      <TableHead>
        <TableHeader>Name</TableHeader>
        <TableHeader>Alias</TableHeader>
        <TableHeader>Actions</TableHeader>
      </TableHead>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  );
}

interface RulesetsPageProps {
  rulesets: Ruleset[];
}

/**
 * Renders a development page for listing all rulesets
 */
export default function Rulesets(props: RulesetsPageProps) {
  return (
    <Page>
      <h1>Rulesets</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <Link href="/dev/rulesets/new"><Button>New</Button></Link>
      <ClientOnly>
        <RulesetTable/>
      </ClientOnly>
    </Page>
  );
}
