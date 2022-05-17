import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ContentTypeData } from "controllers/data/ContentTypeData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import React from "react";

const ContentTypeRow = observer((props: any) => {
  const contentType = ContentTypeData.get(props.id);
  if (!contentType) { return <></>; }

  const ruleset = RulesetData.get((contentType.ruleset)?.ref);

  return (
    <TableRow>
      <TableCell>{contentType.name}</TableCell>
      <TableCell>{ruleset?.name || contentType.ruleset?.name}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
});

const ContentTypeTable = observer((props: any) => {
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

export default function ContentTypes() {
  return (
    <Page>
      <h1>Content Types</h1>
      <ContentTypeTable/>
    </Page>
  );
}
