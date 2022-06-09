import { Button } from "@owl-factory/components/button";
import { Table, TableBody, TableHead, TableHeader } from "components/elements/table";
import React from "react";



export function StaticVariableArrayInput(props: any) {
  
  return (
    <>
      <Table>
        <TableHead>
          <TableHeader></TableHeader>
          <TableHeader>#</TableHeader>
          <TableHeader>Value</TableHeader>
          <TableHeader>Actions</TableHeader>
        </TableHead>
        <TableBody>

        </TableBody>
      </Table>
      <Button>+</Button>
    </>
  );
}
