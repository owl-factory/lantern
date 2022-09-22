import { Button } from "@chakra-ui/react";
import { Ref64 } from "@owl-factory/types";
import { ContentType, Ruleset } from "@prisma/client";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row of the content type table
 */
const ContentTypeRow = observer((props: { id: Ref64 }) => {
  const contentType = {} as ContentType;
  const ruleset = {} as Ruleset;
  if (!contentType) { return <></>; }


  return (
    <TableRow>
      <TableCell>{contentType.name}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/content-types/${contentType.id}/edit`}>Edit</Link>&nbsp;
        {/* <a href="#" onClick={() => ContentTypeData.delete(contentType.ref as string)}>Delete</a> */}
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table for displaying a list of content types
 */
const ContentTypeTable = observer(() => {

  const contentTypes: ContentType[] = [];
  const rows: JSX.Element[] = [];

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
