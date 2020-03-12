
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow,
} from "@material-ui/core";
import react from "react";
import Pagination, {usePageState} from "./Pagination";

export interface ILayoutItem {
  title: string;
  key?: string;
  component?: (content: any) => JSX.Element; // A JSX element given content[i] as a content arg
  // TODO - put in static content for actions
}

interface ITable {
  count?: number; // Total number of items to use
  perPage?: number; // Total number of items to use per page
  graphqlQuery?: any; // The graphql query to use and modify
  json?: string; // Raw JSON to parse into a table
  layout: ILayoutItem[]; // Instructions for how to write the layout
}

interface ITableHead {
  layout: ILayoutItem[]; // Instructions for how to write the layout
}

interface ITableBody {
}

interface ITableCell {
  children?: any;
  content?: any;
  layoutItem?: ILayoutItem;
}

/**
 * Renders the contents of the table cell.
 * @param props see ITableCell
 */
function renderCellContent(props: ITableCell) {
  let cellContent: string | JSX.Element = "";

  if (props.layoutItem === undefined || props.content === undefined) {
    return "";
  }

  if (props.layoutItem.key !== undefined && props.content[props.layoutItem.key] !== undefined) {
    cellContent = props.content[props.layoutItem.key];
  } else if (props.layoutItem.component !== undefined) {
    cellContent = props.layoutItem.component(props);
  }

  return cellContent;
}

/**
 * Renders the table cell, either a static value or a component
 * @param props see ITableCell
 */
function TableCell(props: ITableCell) {
  let cellContent: JSX.Element | string = "";

  if (props.children !== undefined) {
    cellContent = props.children;
  } else {
    cellContent = renderCellContent(props);
  }

  return (
    <MuiTableCell>
      {cellContent}
    </MuiTableCell>
  );
}

/**
 * Renders the body of the table
 *
 * @param props see ITableBody
 */
function TableBody(props: any) {
  const contentArray: any[] = JSON.parse(props.contents);
  const rows: JSX.Element[] = [];

  for (let i = props.offset; i < (props.perPage + props.offset); i++) {
    if (i >= contentArray.length) {
      break;
    }

    const content = contentArray[i];

    const cells: JSX.Element[] = [];
    props.layout.forEach((layoutItem: ILayoutItem) => {
      cells.push(<TableCell content={content} layoutItem={layoutItem}/>);
    });

    rows.push(<TableRow>{cells}</TableRow>);
  }

  return (
    <MuiTableBody>
      {rows}
    </MuiTableBody>
  );
}

/**
 * Renders the head of the table in a consistent manner
 * @param props See ITableHead
 */
function TableHead(props: ITableHead) {
  const tableHeadContents: JSX.Element[] = [];

  props.layout.forEach((layoutItem: ILayoutItem) => {
    tableHeadContents.push(
      <MuiTableCell>
        { layoutItem.title }
      </MuiTableCell>,
    );
  });

  return (
    <MuiTableHead>
      <TableRow>
        { tableHeadContents }
      </TableRow>
    </MuiTableHead>
  );
}

/**
 * Creates a sinple generic default value function.
 *
 * @param arg The original argument
 * @param defaultValue The default value if the arg is undefined
 */
function def<T>(arg: T | undefined, defaultValue: T): T {
  if (arg === undefined) {
    return defaultValue;
  }
  return arg;
}

/**
 * Renders a standard table for consistent formating, design, and pagination
 * @param props see ITable
 */
function Table(props: ITable) {
  const perPage = def<number>(props.perPage, 25);

  const [contents, setContents] = react.useState(
    def<string>(props.json, "[]"),
  );
  const [state, setState] = usePageState();
  const willQuery = props.graphqlQuery !== undefined;

  /**
   * A function for setting the current page.
   * TODO - can this be moved to pagination? It should be similar for everything
   * @param page The page to switch to
   */
  function setPage(page: number) {
    let offset: number = 0;
    
    if (willQuery === false) {
      offset = (page - 1) * state.perPage;
    } else {
      // TODO - run query once GraphQL is setup
    }

    setState({...state, currentPage: page, offset});
  }

  return (
    <div>
      <MuiTable>
        <TableHead layout={props.layout}/>
        <TableBody
          contents={contents}
          layout={props.layout}
          page={state.currentPage}
          perPage={state.perPage}
          offset={state.offset}
        />
      </MuiTable>

      <Pagination pageState={state}/>
    </div>
  );
}

export default Table;
