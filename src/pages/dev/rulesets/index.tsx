import { Button } from "@owl-factory/components/button";
import { Ref64 } from "@owl-factory/types";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row for a ruleset table
 */
const RulesetRow = observer((props: { id: Ref64 }) => {
  const ruleset = RulesetData.get(props.id);
  if (!ruleset) { return <></>; }

  return (
    <TableRow>
      <TableCell>{ruleset.name}</TableCell>
      <TableCell>{ruleset.alias}</TableCell>
      <TableCell>
        <Link href={`/dev/rulesets/${ruleset.ref}/edit`}>Edit</Link>
        <Link href={`/dev/rulesets/${ruleset.ref}/new-module`}>New Module</Link>&nbsp;
        <Link href={`/dev/rulesets/${ruleset.ref}/new-actor-sheet`}>New Character Sheet</Link>&nbsp;
        <a onClick={() => RulesetData.delete(ruleset.ref as string)}>Delete</a>
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table to list out all rulesets
 */
const RulesetTable = observer(() => {
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
  }, []);

  const rulesets = RulesetData.search({ group: "data" });
  const rows: JSX.Element[] = [];

  for (const ref of rulesets) {
    rows.push(<RulesetRow key={ref} id={ref}/>);
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
