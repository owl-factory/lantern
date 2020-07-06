import React from "react";
import Table from "./Table";
import Pagination, { usePageState } from "../Pagination";

export default function PaginatedTable(props: any) {
  const [pageState, setPageState] = usePageState();

  return (
    <>
      <Table columns={props.columns} data={props.data} />
      <Pagination pageState={pageState} setPageState={setPageState}/>
    </>
  )
}