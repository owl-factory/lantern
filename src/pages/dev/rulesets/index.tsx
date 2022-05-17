import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import React from "react";

const RulesetRow = observer((props: any) => {
  const ruleset = RulesetData.get(props.id);
  if (!ruleset) { return <></>; }

  return (
    <TableRow>
      <TableCell>{ruleset.name}</TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
});

const RulesetTable = observer((props: any) => {
  React.useEffect(() => {
    RulesetData.searchIndex(`/api/rulesets/list`);
  }, []);

  const rulesets = RulesetData.search({ group: "data" });
  const rows: JSX.Element[] = [];

  for (const ref of rulesets) {
    rows.push(<RulesetRow key={ref} id={ref}/>);
  }

  return (
    <Table>
      <TableHead>
        <TableHeader>Name</TableHeader>
        <TableHeader>Actions</TableHeader>
      </TableHead>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  );
});

export default function Rulesets() {

  return (
    <Page>
      <h1>Rulesets</h1>
      <RulesetTable/>
    </Page>
  );
}
