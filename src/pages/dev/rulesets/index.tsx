import { Button } from "@owl-factory/components/button";
import { Ref64 } from "@owl-factory/types";
import { Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row for a ruleset table
 */
const RulesetRow = observer((props: { id: Ref64 }) => {
  const ruleset = {} as Ruleset;
  if (!ruleset) { return <></>; }

  return (
    <TableRow>
      <TableCell>{ruleset.name}</TableCell>
      <TableCell>{ruleset.alias}</TableCell>
      <TableCell>
        <Link href={`/dev/rulesets/${ruleset.id}/edit`}>Edit</Link>
        <Link href={`/dev/rulesets/${ruleset.id}/new-module`}>New Module</Link>&nbsp;
        <Link href={`/dev/rulesets/${ruleset.id}/new-actor-sheet`}>New Character Sheet</Link>&nbsp;
        {/* <a onClick={() => RulesetData.delete(ruleset.ref as string)}>Delete</a> */}
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table to list out all rulesets
 */
const RulesetTable = observer(() => {

  const rulesets: Ruleset[] = [];
  const rows: JSX.Element[] = [];

  for (const ruleset of rulesets) {
    rows.push(<RulesetRow key={ruleset.id} id={ruleset.id}/>);
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
});

/**
 * Renders a development page for listing all rulesets
 */
export default function Rulesets() {
  return (
    <Page>
      <h1>Rulesets</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <RulesetTable/>
    </Page>
  );
}
