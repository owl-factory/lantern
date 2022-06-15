import { Button } from "@owl-factory/components/button";
import { SearchParams } from "@owl-factory/data/types";
import { Ref64 } from "@owl-factory/types";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ActorData } from "controllers/data/ActorData";
import { RulesetData } from "controllers/data/RulesetData";
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
  const actor = ActorData.get(props.id);

  // Ensures that the ruleset is loaded in
  React.useEffect(() => {
    // TODO - change to softload when that is merged in
    if (actor?.ruleset?.ref) { RulesetData.load(actor?.ruleset?.ref); }
  }, [actor, actor?.ruleset]);

  if (!actor) { return <></>; }
  const ruleset = RulesetData.get(actor.ruleset?.ref);

  return (
    <TableRow>
      <TableCell>{actor.name}</TableCell>
      <TableCell>{actor.actorType}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table of actors matching the given criteria
 */
const ActorTable = observer((props: { searchParams?: SearchParams }) => {
  const rows: JSX.Element[] = [];

  const actorRefs = ActorData.search(props.searchParams);

  for (const actorRef of actorRefs) {
    rows.push(<ActorRow key={actorRef} id={actorRef} />);
  }

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
  React.useEffect(() => {
    ActorData.searchIndex(`/api/actors/all`);
  }, []);
  return (
    <Page>
      <h1>Actors</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ActorTable/>
    </Page>
  );
}

export default ActorList;
