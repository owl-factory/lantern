import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { ModuleData } from "controllers/data/ModuleData";
import { RulesetData } from "controllers/data/RulesetData";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import React from "react";

/**
 * Renders a single row for a module table
 */
const ModuleRow = observer((props: any) => {
  const module = ModuleData.get(props.id);
  React.useEffect(() => {
    if (module?.ruleset?.ref) { RulesetData.softLoad((module.ruleset)?.ref); }
  }, [module, module?.ruleset?.ref]);

  if (!module) { return <></>; }

  const ruleset = RulesetData.get((module.ruleset)?.ref);

  return (
    <TableRow>
      <TableCell>{module.name}</TableCell>
      <TableCell>{ruleset?.name}</TableCell>
      <TableCell>
        <Link href={`/dev/modules/${module.ref}/edit`}>Edit</Link>&nbsp;
        <a href="#" onClick={() => ModuleData.delete(module.ref as string)}>Delete</a>
      </TableCell>
    </TableRow>
  );
});

/**
 * Renders a table of modules
 */
const ModuleTable = observer(() => {
  React.useEffect(() => {
    ModuleData.searchIndex(`/api/modules/list`);
  }, []);

  const modules = ModuleData.search({ group: "data" });
  const rows: JSX.Element[] = [];

  for (const ref of modules) {
    rows.push(<ModuleRow key={ref} id={ref}/>);
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
 * Renders a development page for listing and searching through all modules
 */
export default function Modules() {
  return (
    <Page>
      <h1>Modules</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ModuleTable/>
    </Page>
  );
}
