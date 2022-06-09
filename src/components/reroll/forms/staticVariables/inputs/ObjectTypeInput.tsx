import { Button } from "@owl-factory/components/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import React from "react";
import { StaticVariableScalarType } from "types/documents/subdocument/StaticVariable";
import { getNextUntitled } from "utilities/helpers";

function ObjectTypeRow(props: any) {
  return (
    <TableRow>
      <TableCell></TableCell>
    </TableRow>
  );
}

interface StaticVariableObjectTypeInputProps {
  objectType: Record<string, StaticVariableScalarType | null>;
  setObjectType: (objectType: Record<string, StaticVariableScalarType | null>) => void;
}

export function StaticVariableObjectTypeInput(props: StaticVariableObjectTypeInputProps) {
  const objectTypeKeys = Object.keys(props.objectType);
  const rows: JSX.Element[] = [];

  function addType() {
    const key = getNextUntitled(objectTypeKeys);
    const objectType = { ...props.objectType, [key]: StaticVariableScalarType.String };
    props.setObjectType(objectType);
  }

  function removeType(key: string) {
    const objectType = { ...props.objectType, [key]: null };
    props.setObjectType(objectType);
  }

  for (const key of objectTypeKeys) {
    const objectType = props.objectType[key];
    if (objectType === null) { continue; }
    rows.push(
      <ObjectTypeRow key={key} id={key} />
    )
  }

  return (
    <>
      <h4>Object Type</h4>
      <Table>
        <TableHead>
          <TableHeader>Key</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableHead>

        <TableBody>

        </TableBody>
      </Table>
      <Button onClick={addType}>+</Button>
    </>
  )
}