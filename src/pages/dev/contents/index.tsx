import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ContentData } from "controllers/data/ContentData";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import React from "react";

const ContentRow = observer((props: any) => {
  const content = ContentData.get(props.id);
  if (!content) { return <></>; }

  const contentType = ContentTypeData.get(content.contentType?.ref);
  const ruleset = RulesetData.get(content.ruleset?.ref);

  return (
    <TableRow>
      <TableCell>{content.name}</TableCell>
      <TableCell>{contentType?.name || content.contentType?.name}</TableCell>
      <TableCell>{ruleset?.name || content.ruleset?.name}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
});

const ContentTable = observer((props: any) => {
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

export default function Contents() {
  return (
    <Page>
      <h1>Contents</h1>
      <ContentTable/>
    </Page>
  );
}
