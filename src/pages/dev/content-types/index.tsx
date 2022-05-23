import { Button } from "@owl-factory/components/button";
import { Ref64 } from "@owl-factory/types";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row of the content type table
 */
const ContentTypeRow = observer((props: { id: Ref64 }) => {
  const contentType = ContentTypeData.get(props.id);
  if (!contentType) { return <></>; }

  const ruleset = RulesetData.get((contentType.ruleset)?.ref);

  return (
    <TableRow>
      <TableCell>{contentType.name}</TableCell>
      <TableCell>{ruleset?.name || contentType.ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/content-types/${contentType.ref}/edit`}>Edit</Link>
        <a href="#" onClick={() => ContentTypeData.delete(contentType.ref as string)}>Delete</a>
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table for displaying a list of content types
 */
const ContentTypeTable = observer(() => {
  React.useEffect(() => {
    ContentTypeData.searchIndex(`/api/content-types/list`);
  }, []);

  const contentTypes = ContentTypeData.search({ group: "data" });
  const rows: JSX.Element[] = [];

  for (const ref of contentTypes) {
    rows.push(<ContentTypeRow key={ref} id={ref}/>);
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
 * Renders a table listing all content types
 */
export default function ContentTypes() {
  return (
    <Page>
      <h1>Content Types</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ContentTypeTable/>
    </Page>
  );
}
