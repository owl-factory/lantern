import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { def, min } from "../../helpers/tools";

interface IPagination {
  pageState: IPageState; // The state of the page to use and update
  setPageState: (pageState: IPageState) => (void); // Function to update the page state
  onPageChange?: (pageState: IPageState) => (void); // A callback function
  useOffset?: boolean; // Indicates whether to set the offset for static page values
}

interface IPageState {
  currentPage: number; // The current page
  perPage: number; // The number of items per page
  totalCount: number; // The total number of items
  offset: number; // An offset for handling static lists
}

interface IPaginationCell {
  targetPage: number; // The target page
  pageText?: string; // Alternate text to put on the link, eg "Last"
  setPage: (page: number) => (void); // Alternate text to put on the link, eg "Last"
  hasLink?: boolean; // Whether to have this as a link or a static button (eg for current page)
}

/**
 * Builds a state and useState to use for pagination
 * @param perPage - number of items per page
 * @param totalCount Total number of items
 */
export function usePageState(perPage: number = 25, totalCount: number = 181) {
  return React.useState({currentPage: 1, perPage, totalCount, offset: 0});
}

/**
 * Renders a single pagination cell
 * @param props See IPaginationCell
 */
function PaginationCell(props: IPaginationCell) {
  const pageText = def<string>(props.pageText, props.targetPage.toString());
  return (
    <Tab label={pageText} onClick={() => {props.setPage(props.targetPage); }}/>
  );
}

/**
 * Renders pagination and handles pagination-related actions
 * @param props see IPagination
 */
function Pagination(props: IPagination) {
  const useOffset = def<boolean>(props.useOffset, false);
  const perPage = min(props.pageState.perPage, 1);
  const maxPage = Math.ceil(props.pageState.totalCount / perPage);
  let activePageIndex: number = 0;

  /**
   * Sets the page and runs associated actions
   * @param page The page to set to
   */
  function setPage(page: number) {
    let offset: number = 0;
    if (useOffset === true) {
      offset = (page - 1) * perPage;
    }
    props.setPageState({...props.pageState, currentPage: page, perPage, offset});

    if (props.onPageChange === undefined) {
      return;
    }
    props.onPageChange(props.pageState);
  }

  /**
   * Renders the pagination cells
   */
  function renderCells() {
    const renderedCells: JSX.Element[] = [];
    const width: number = 3;
    activePageIndex = 0;

    // Render current page
    renderedCells.push(
      <PaginationCell
        key="page_current"
        targetPage={props.pageState.currentPage}
        hasLink={false}
        setPage={setPage}
      />,
    );

    // Render side pages
    for (let i: number = 1; i < width; i++) {
      let targetPage: number = props.pageState.currentPage - i;
      if (targetPage > 0) {
        renderedCells.unshift(<PaginationCell key={"page_" + targetPage} targetPage={targetPage} setPage={setPage}/>);
        activePageIndex++;
      }

      targetPage = props.pageState.currentPage + i;
      if (targetPage <= maxPage) {
        renderedCells.push(<PaginationCell key={"page_" + targetPage} targetPage={targetPage} setPage={setPage}/>);
      }
    }

    // Render first
    if (props.pageState.currentPage - width >= 1) {
      renderedCells.unshift(<PaginationCell key="page_first" pageText="First" targetPage={1} setPage={setPage}/>);
      activePageIndex++;
    }

    // Render last
    if (props.pageState.currentPage + width <= maxPage) {
      renderedCells.push(<PaginationCell key="page_last" pageText="Last" targetPage={maxPage} setPage={setPage}/>);
    }

    return renderedCells;
  }

  const cells = renderCells();

  return (
    <Paper square>
      <Tabs value={activePageIndex} indicatorColor="primary" textColor="primary" centered>
        {cells}
      </Tabs>
    </Paper>
  );
}

export default Pagination;
