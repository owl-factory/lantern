import { Button } from "@chakra-ui/react";
import { Ref64 } from "types";
import { Actor, ActorType, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

interface ActorRowProps {
  id: Ref64;
}

/**
 * Renders a single row to the actor table
 */
const ActorRow = observer((props: ActorRowProps) => {
  const actor = {} as Actor;
  const actorType = {} as ActorType;

  if (!actor) { return <></>; }
  const ruleset = {} as Ruleset;

  return (
    <TableRow>
      <TableCell>{actor.name}</TableCell>
      <TableCell>{actorType.name}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
        <a href={`/dev/actors/${actor.id}`}>View</a>&nbsp;
        {/* <a href="#" onClick={() => ActorData.delete(actor.ref as string)}>Delete</a>&nbsp; */}
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table of actors matching the given criteria
 */
const ActorTable = observer(() => {
  const rows: JSX.Element[] = [];

  return (
    <Table>
      <TableHead>
        <TableHeader>Name</TableHeader>
        <TableHeader>Actor Type</TableHeader>
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
 * Renders a list of all actors
 */
function ActorList() {
  return (
    <Page>
      <h1>Actors</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ActorTable/>
    </Page>
  );
}

export default ActorList;
