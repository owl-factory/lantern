import { Table, TableBody, TableHead, TableHeader } from "components/elements/table";
import React from "react";
import { StaticVariable } from "types/documents/subdocument/StaticVariable";
import { StaticVariableFormValues } from "../StaticVariableForm";

interface ObjectTypeInputProps {

}

function ObjectTypeInput(props: ObjectTypeInputProps) {
  const rows: JSX.Element[] = [];

  return (
    <Table>
      <TableHead>
        <TableHeader>Key</TableHeader>
        <TableHeader>Type</TableHeader>
        <TableHeader>Actions</TableHeader>
      </TableHead>

      <TableBody>
        {rows}
      </TableBody>
    </Table>
  );
}

function ObjectArrayInput(props: any) {
  return (
    <>List Input</>
  );
}

interface StaticVariableObjectArrayInputProps {
  staticVariable: StaticVariable & StaticVariableFormValues;
  setStaticVariableField: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

export function StaticVariableObjectArrayInput(props: StaticVariableObjectArrayInputProps) {
  return (
    <>
      <ObjectTypeInput />
      <ObjectArrayInput/>
    </>
  );
}
