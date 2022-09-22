import { Button } from "@owl-factory/components/button";
import { Ref64 } from "@owl-factory/types";
import { ActorSheet, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

/**
 * Renders a single row for an actor sheet table
 * @param id The ID of the actor sheet to render
 */
const ActorSheetRow = observer((props: { id: Ref64 }) => {
  const router = useRouter();
  const actorSheet = {} as ActorSheet;
  if (!actorSheet) { return <></>; }

  const ruleset: Ruleset = {} as Ruleset;

  /**
   * Creates a new actor, and on success redirects the user to the page
   */
  async function createActor() {
    if (!actorSheet) { return; }
    // TODO - create new actor
    // if (!newActor) { throw "Actor could not be created"; }
    // router.push(`/dev/actors/${newActor.ref}`);
  }

  return (
    <TableRow>
      <TableCell>{actorSheet.name}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/actor-sheets/${actorSheet.id}`}>View</Link>&nbsp;
        <Link href={`/dev/actor-sheets/${actorSheet.id}/edit`}>Edit</Link>&nbsp;
        <a href={`/api/actor-sheets/${actorSheet.id}/export.xml`} download={`${actorSheet.name}.xml`}>Export</a>&nbsp;
        <a href="#" onClick={createActor}>New Character</a>&nbsp;
        {/* <a href="#" onClick={() => ActorSheetData.delete(actorSheet.id as string)}>Delete</a> */}
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table for listing out actor sheets
 */
const ActorSheetTable = observer(() => {
  const rows: JSX.Element[] = [];
  // const sheetRefs = ActorSheetData.search({});
  // for (const sheetRef of sheetRefs) {
  //   rows.push(<ActorSheetRow key={sheetRef} id={sheetRef}/>);
  // }

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
