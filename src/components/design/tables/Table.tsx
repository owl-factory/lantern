import React from "react";
import { Table as BSTable } from "react-bootstrap"
import { def } from "../../../helpers/tools";
import { Column } from "../../../models/design/table";

interface TableProps {
  columns: Column[]; // The column configuration
  data: any[]; // An array of data to render
  startingIncrement?: number; // The number to begin incrementation on
}

interface TableHeaderProps {
  columns: Column[]; // The column configuration
}

interface TableBodyProps {
  columns: Column[]; // The column configuration
  data: any[]; // An array of data to render
  startingIncrement?: number; // The number to begin incrementation on
}

interface TableRowProps {
  columns: Column[]; // The column configuration
  data: any; // The object with data to render
  increment: number; // The current row increment
}

/**
 * Renders the header of a table
 * @param props see TableHeaderProps
 */
function TableHeader(props: TableHeaderProps) {
  const headers: JSX.Element[] = [];
  props.columns.forEach((column: Column) => {
    headers.push(
      <th key={"row0-" + column.header}>{column.header}</th>
    );
  });

  return (<thead><tr>{headers}</tr></thead>);
}

/**
 * Renders the body of the table
 * @param props see TableBodyProps
 */
function TableBody(props: TableBodyProps) {
  const rows: JSX.Element[] = [];
  let increment = def<number>(props.startingIncrement, 1); 

  props.data.forEach((rowData: any) => {
    rows.push(<TableRow key={"row-" + increment} {...props} data={rowData} increment={increment++}/>);
  });
  return <tbody>{rows}</tbody>;
}

/**
 * Renders a single row in a table
 * @param props see TableRowProps
 */
function TableRow(props: TableRowProps) {
  const row: JSX.Element[] = [];
  let columnIncrement = 0;
  let content: JSX.Element | number | string | undefined = undefined;

  props.columns.forEach((column: any) => {
    if (column.key !== undefined) {
      content = props.data[column.key];

    } else if (column.component !== undefined) {
      content = column.component(props.data);

    } else if (column.increment === true) {
      content = props.increment;

    }

    row.push(<td key={"cell-" + props.increment + "-" + columnIncrement++}>{content}</td>)
  });

  return <tr>{row}</tr>;
}

/**
 * Renders a table based off of given data and column configuration
 * @param props see TableProps
 */
export default function Table(props: TableProps) {
  return (
    <BSTable>
      <TableHeader columns={props.columns}/>
      <TableBody columns={props.columns} data={props.data}/>
    </BSTable>
  );
}