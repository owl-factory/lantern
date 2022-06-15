import { Button } from "@owl-factory/components/button";
import { Ref64 } from "@owl-factory/types";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row for an actor sheet table
 * @param id The ID of the actor sheet to render
 */
const ActorSheetRow = observer((props: { id: Ref64 }) => {
  const actorSheet = ActorSheetData.get(props.id);
  if (!actorSheet) { return <></>; }

  const ruleset = RulesetData.get((actorSheet.ruleset)?.ref);

  return (
    <TableRow>
      <TableCell>{actorSheet.name}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/actor-sheets/${actorSheet.ref}`}>View</Link>&nbsp;
        <Link href={`/dev/actor-sheets/${actorSheet.ref}/edit`}>Edit</Link>&nbsp;
        <a href="#" onClick={() => ActorSheetData.delete(actorSheet.ref as string)}>Delete</a>
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table for listing out actor sheets
 */
const ActorSheetTable = observer(() => {
  React.useEffect(() => {
    ActorSheetData.searchIndex(`/api/actor-sheets/all`);
  }, []);

  const rows: JSX.Element[] = [];
  const sheetRefs = ActorSheetData.search({});
  for (const sheetRef of sheetRefs) {
    rows.push(<ActorSheetRow key={sheetRef} id={sheetRef}/>);
  }

  return (
    <Table>
      <TableHead>
        <TableHeader>Name</TableHeader>
        <TableHeader>Ruleset</TableHeader>
        <TableHeader>Actions</TableHeader>
      </TableHead>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  );
});

/**
 * Renders a page containing a list of actor sheets
 */
export default function ActorSheetList() {
  return (
    <Page>
      <h1>Actor Sheet Layouts</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ActorSheetTable />
    </Page>
  );
}
