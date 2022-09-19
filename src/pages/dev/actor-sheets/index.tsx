import { Button } from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { rest } from "@owl-factory/https";
import { ActorSheet, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import Link from "next/link";
import React from "react";
import { getActorSheets } from "src/pages/api/dev/actor-sheets";

type ActorSheetWithRuleset = ActorSheet & { ruleset: Ruleset };

interface ActorSheetRowProps {
  actorSheet: ActorSheetWithRuleset;
  deleteActorSheet: (actorSheet: ActorSheet) => void;
}

/**
 * Renders a single row for an actor sheet table
 * @param id The ID of the actor sheet to render
 */
function ActorSheetRow(props: ActorSheetRowProps) {
  if (!props.actorSheet) { return <></>; }
  const actorSheet = props.actorSheet;
  const ruleset = props.actorSheet.ruleset;

  return (
    <TableRow>
      <TableCell>{actorSheet.name}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/actor-sheets/${actorSheet.id}`}>View</Link>&nbsp;
        <Link href={`/dev/actor-sheets/${actorSheet.id}/edit`}>Edit</Link>&nbsp;
        <a href={`/api/actor-sheets/${actorSheet.id}/export.xml`} download={`${actorSheet.name}.xml`}>Export</a>&nbsp;
        <a href="#" onClick={() => props.deleteActorSheet(props.actorSheet)}>Delete</a>
      </TableCell>
    </TableRow>
  );
}

interface ActorSheetTableProps {
  actorSheets: ActorSheetWithRuleset[]
  deleteActorSheet: (actorSheet: ActorSheet) => void;
}

/**
 * Renders a table for listing out actor sheets
 */
function ActorSheetTable(props: ActorSheetTableProps) {
  const rows: JSX.Element[] = [];
  for (const actorSheet of props.actorSheets) {
    rows.push(<ActorSheetRow key={actorSheet.id} actorSheet={actorSheet} deleteActorSheet={props.deleteActorSheet}/>);
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
}

interface ActorSheetListProps {
  actorSheets: ActorSheetWithRuleset[];
}

interface DeleteServerResponse {
  deletedActorSheet: ActorSheet;
  actorSheets: ActorSheetWithRuleset[];
}

/**
 * Renders a page containing a list of actor sheets
 */
export default function ActorSheetList(props: ActorSheetListProps) {
  const [ actorSheets, setActorSheets ] = React.useState(props.actorSheets);

  /**
   * Deletes an actor sheet and refreshes the actor sheets
   * @param actorSheet The actor sheet to delete
   */
  async function deleteActorSheet(actorSheet: ActorSheet) {
    try {
      const deleteResult = await rest.delete<DeleteServerResponse>(`/api/dev/actor-sheets/${actorSheet.id}`, {});
      if (!deleteResult.success) {
        AlertController.error(`${actorSheet.name} could not be successfully deleted. ${deleteResult.message}`);
        return;
      }
      AlertController.success(`${actorSheet.name} was successfully deleted.`);
      setActorSheets(deleteResult.data.actorSheets);
    } catch (e) {
      AlertController.error(`An unexpected error occured while attempting to delete ${actorSheet.name}.`);
    }
  }

  return (
    <Page>
      <h1>Actor Sheet Layouts</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ActorSheetTable actorSheets={actorSheets} deleteActorSheet={deleteActorSheet}/>
    </Page>
  );
}

export async function getServerSideProps() {
  const actorSheets = await getActorSheets();
  return { props: { actorSheets } };
}
