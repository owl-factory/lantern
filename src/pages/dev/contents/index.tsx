import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ContentData } from "controllers/data/ContentData";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row of the content table
 */
const ContentRow = observer((props: { id: string }) => {
  const content = ContentData.get(props.id);
  React.useEffect(() => {
    if (content?.ruleset?.ref) { RulesetData.softLoad((content.ruleset)?.ref); }
    if (content?.contentType?.ref) { ContentTypeData.softLoad((content.contentType)?.ref); }
  }, [content, content?.ruleset?.ref]);
  if (!content) { return <></>; }

  const contentType = ContentTypeData.get(content.contentType?.ref);
  const ruleset = RulesetData.get(content.ruleset?.ref);

  return (
    <TableRow>
      <TableCell>{content.name}</TableCell>
      <TableCell>{contentType?.name || content.contentType?.name}</TableCell>
      <TableCell>{ruleset?.name || content.ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/contents/${content.ref}/edit`}>Edit</Link>&nbsp;
        <a href="#" onClick={() => ContentData.delete(content.ref as string)}>Delete</a>
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table for displaying a list of contents
 */
const ContentTable = observer(() => {
  React.useEffect(() => {
    ContentData.searchIndex(`/api/contents/list`);
  }, []);

  const contents = ContentData.search({ group: "data" });
  const rows: JSX.Element[] = [];

  for (const ref of contents) {
    rows.push(<ContentRow key={ref} id={ref}/>);
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
