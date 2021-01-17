import React from "react";
import { Table as BSTable } from "react-bootstrap";
import { MdUnfoldMore, MdExpandLess, MdExpandMore } from "react-icons/md";
import { Column, TableDataType } from "../../../types/design/table";

type RowAction = (index: number, data: TableDataType, globalData?: TableDataType) => void;

interface TableProps {
  columns: Column[]; // The column configuration
  data: TableDataType[]; // An array of data to render
  globalData?: TableDataType;
  // An action that may be applied to the whole row
  rowAction?: RowAction;
  startingIncrement?: number; // The number to begin incrementation on
  sortBy?: string;
  setSortBy?: (sortBy: string) => void;
}

interface TableHeaderProps {
  columns: Column[]; // The column configuration
  lastSortBy: string; // The last sorted by column
  setSortBy: (sortBy: string) => void; // The function to set the sorted key
}

interface TableBodyProps {
  columns: Column[]; // The column configuration
  data: TableDataType[]; // An array of data to render
  globalData?: TableDataType; // Any data that is static across all rows
  // An action that may be applied to the whole row
  rowAction?: RowAction;
  startingIncrement?: number; // The number to begin incrementation on
}

interface TableRowProps {
  columns: Column[]; // The column configuration
  data: TableDataType; // The object with data to render
  globalData?: TableDataType; // Any data that is static across all rows
  // An action that may be applied to the whole row
  rowAction?: RowAction;
  increment: number; // The current row increment
}

/**
 * Renders the header of a table
 * @param props see TableHeaderProps
 */
function TableHeader(props: TableHeaderProps) {
  const headers: JSX.Element[] = [];
  props.columns.forEach((column: Column) => {
    let icon = undefined;
    let onClick = () => {};
    if (column.sortable) {
      const key = column.key || ""
      onClick = () => props.setSortBy(key);
      icon = <MdUnfoldMore/>

      if (key === props.lastSortBy) { icon = <MdExpandLess/> }
      else if ("-" + key === props.lastSortBy) { icon = <MdExpandMore/> }
    }
    
    headers.push(
      <th key={"row0-" + column.header} onClick={onClick}>
        {column.header}{icon}
      </th>
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
  let increment = props.startingIncrement || 1;

  props.data.forEach((rowData: TableDataType) => {
    rows.push(
      <TableRow
        key={"row-" + increment}
        {...props}
        data={rowData}
        rowAction={props.rowAction}
        increment={increment++}
      />
    );
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
  let onClick = undefined;
  const rowAction = props.rowAction ? props.rowAction : () => {return;};

  // This might break some stuff. We need to test it because otherwise we have
  // issues with "this might not be defined"
  onClick = () => (rowAction(props.increment, props.data, props.globalData));
  const typedData = props.data as Record<string, unknown>;

  props.columns.forEach((column: Column) => {
    if (column.key !== undefined) {
      content = typedData[column.key] as (string | number | JSX.Element | undefined);
      if (column.modification) {
        content = column.modification(typedData[column.key] as (string | boolean));
      }

    } else if (column.component !== undefined) {
      content = column.component({
        data: props.data as Record<string, unknown>,
        globalData: props.globalData as Record<string, unknown>,
      });

    } else if (column.increment === true) {
      content = props.increment;

    }

    row.push(<td
      key={"cell-" + props.increment + "-" + columnIncrement++}

    >{content}</td>);
  });

  return <tr onClick={onClick}>{row}</tr>;
}

/**
 * Renders a table based off of given data and column configuration
 * @param props see TableProps
 */
export default function Table(props: TableProps): JSX.Element {  
  function setSortBy(sortBy: string) {
    if (!props.setSortBy) { return; }
    if (sortBy == props.sortBy) { sortBy = "-" + sortBy; }
    props.setSortBy(sortBy);
  }
  
  return (
    <BSTable>
      <TableHeader 
        columns={props.columns}
        lastSortBy={props.sortBy || ""}
        setSortBy={setSortBy}
      />
      <TableBody
        columns={props.columns}
        data={props.data}
        globalData={props.globalData}
        rowAction={props.rowAction}
        startingIncrement={props.startingIncrement}
      />
    </BSTable>
  );
}
