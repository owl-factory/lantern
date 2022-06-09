import { Table, TableBody, TableHead, TableHeader } from "components/elements/table";
import React from "react";

function ObjectTypeRow() {
  
}

export function StaticVariableObjectTypeInput(props: any) {
  function addType() {
    props.set
    return;
  }

  function removeType() {
    return;
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
    </>
  )
}