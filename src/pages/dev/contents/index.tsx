import { Button } from "@chakra-ui/react";
import { Content, ContentType, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row of the content table
 */
const ContentRow = observer((props: { id: string }) => {
  const content = {} as Content;
  if (!content) { return <></>; }

  const contentType = {} as ContentType;
  const ruleset = {} as Ruleset;

  return (
    <TableRow>
      <TableCell>{content.name}</TableCell>
      <TableCell>{contentType?.name}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/contents/${content.id}/edit`}>Edit</Link>&nbsp;
        {/* <a href="#" onClick={() => ContentData.delete(content.ref as string)}>Delete</a> */}
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table for displaying a list of contents
 */
const ContentTable = observer(() => {

  const contents: Content[] = [];
  const rows: JSX.Element[] = [];

  for (const content of contents) {
    rows.push(<ContentRow key={content.id} id={content.id}/>);
  }

  return (
    <Table>
      <TableHead>
        <TableHeader>Name</TableHeader>
        <TableHeader>Content Type</TableHeader>
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
 * Renders a table listing all contents
 */
export default function Contents() {
  return (
    <Page>
      <h1>Contents</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ContentTable/>
    </Page>
  );
}
