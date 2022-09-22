import { Button } from "@chakra-ui/react";
import { Ref64 } from "@owl-factory/types";
import { Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";
import { getRulesets } from "src/pages/api/dev/rulesets";

/**
 * Renders a single row for a ruleset table
 */
const RulesetRow = observer((props: { ruleset: Ruleset }) => {
  if (!props.ruleset) { return <></>; }

  return (
    <TableRow>
      <TableCell>{props.ruleset.name}</TableCell>
      <TableCell>{props.ruleset.alias}</TableCell>
      <TableCell>
        <Link href={`/dev/rulesets/${props.ruleset.id}/edit`}>Edit</Link>
        <Link href={`/dev/rulesets/${props.ruleset.id}/new-module`}>New Module</Link>&nbsp;
        <Link href={`/dev/rulesets/${props.ruleset.id}/new-actor-sheet`}>New Character Sheet</Link>&nbsp;
        {/* <a onClick={() => RulesetData.delete(ruleset.ref as string)}>Delete</a> */}
      </TableCell>
    </TableRow>
  );
});

interface RulesetTableProps {
  rulesets: Ruleset[];
}

/**
 * Renders a table to list out all rulesets
 */
function RulesetTable(props: RulesetTableProps) {
  const rows: JSX.Element[] = [];

  for (const ruleset of props.rulesets) {
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
      <RulesetTable rulesets={props.rulesets}/>
    </Page>
  );
}

export async function getServerSideProps() {
  const rulesets = await getRulesets();
  return { props: { rulesets } };
}
