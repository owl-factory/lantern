
import {
  Table as MDTable,
  TableBody as MDTableBody,
  TableCell,
  TableHead as MDTableHead,
  TableRow,
} from "@material-ui/core";
import react from "react";
import Pagination, {usePageState} from "./Pagination";

export interface ILayoutItem {
  header: string;
  key: string;
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

/**
 * Renders the body of the table
 * TODO - this is ugly as sin and doesn't handle complex usecases (like links)
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
      cells.push(<TableCell>{content[layoutItem.key]}</TableCell>)
    });

    rows.push(<TableRow>{cells}</TableRow>);
  }

  return (
    <MDTableBody>
      {rows}
    </MDTableBody>
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
      <TableCell>
        { layoutItem.header }
      </TableCell>,
    );
  });

  return (
    <MDTableHead>
      <TableRow>
        { tableHeadContents }
      </TableRow>
    </MDTableHead>
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
      <MDTable>
        <TableHead layout={props.layout}/>
        <TableBody layout={props.layout} contents={contents} page={state.currentPage} perPage={state.perPage} offset={state.offset}/>
      </MDTable>

      <Pagination pageState={state}/>
    </div>
  );
}

export default Table;
