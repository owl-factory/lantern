import { AlertController } from "@owl-factory/alerts";
import { Button } from "@owl-factory/components/button";
import { rest } from "@owl-factory/https";
import { Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";
import { getRulesets } from "src/pages/api/dev/rulesets";

interface RulesetRowProps {
  ruleset: Ruleset;
  deleteRuleset: (ruleset: Ruleset) => void;
}

/**
 * Renders a single row for a ruleset table
 */
const RulesetRow = observer(({ ruleset, deleteRuleset }: RulesetRowProps) => {
  if (!ruleset) { return <></>; }

  return (
    <TableRow>
      <TableCell>{ruleset.name}</TableCell>
      <TableCell>{ruleset.alias}</TableCell>
      <TableCell>
        <Link href={`/dev/rulesets/${ruleset.id}/edit`}>Edit</Link>
        <Link href={`/dev/rulesets/${ruleset.id}/new-module`}>New Module</Link>&nbsp;
        <Link href={`/dev/rulesets/${ruleset.id}/new-actor-sheet`}>New Character Sheet</Link>&nbsp;
        <a onClick={() => deleteRuleset(ruleset)}>Delete</a>
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table to list out all rulesets
 */
const RulesetTable = observer((props: { rulesets: any }) => {
  const [ rulesets, setRulesets ] = React.useState(props.rulesets || []);
  const rows: JSX.Element[] = [];

  /**
   * Deletes a ruleset
   * @param ruleset The ruleset to delete
   */
  async function deleteRuleset(ruleset: Ruleset) {
    try {
      const res = await rest.delete(`/api/dev/rulesets/${ruleset.id}`, {});
      if (!res.success) {
        AlertController.error(`An error occured while attempting to delete ${ruleset.name}: ${res.message}`);
        return;
      }

      await fetchRulesets();
      AlertController.success(`${ruleset.name} was successfully deleted`);
    } catch (e) {
      AlertController.error(`An error occured while attempting to delete ${ruleset.name}`);
    }
  }

  /**
   * Fetches the rulesets
   */
  async function fetchRulesets() {
    try {
      const res = await rest.post<{rulesets: Ruleset[]}>(`/api/dev/rulesets`, {});
      if (!res.success) {
        AlertController.error(`An error occured while attempting to fetch the rulesets: ${res.message}`);
        return;
      }

      setRulesets(res.data.rulesets || []);
    } catch (e) {
      AlertController.error("An error occured while attempting to fetch the rulesets");
    }

  }

  for (const ruleset of rulesets) {
    rows.push(<RulesetRow key={rulesets.id} ruleset={ruleset} deleteRuleset={deleteRuleset}/>);
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
export default function Rulesets(props: any) {
  return (
    <Page>
      <h1>Rulesets</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <RulesetTable rulesets={props.rulesets}/>
    </Page>
  );
}

export async function getServerSideProps() {
  const rulesets = await getRulesets();
  return { props: { rulesets }};
}
