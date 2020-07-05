/* eslint-disable @typescript-eslint/no-inferrable-types */
import React from "react";
import { Pagination as BSPagination } from "react-bootstrap";
import { def, min } from "../../helpers/tools";

interface PaginationProps {
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

interface PaginationCellProps {
  className?: string;
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

function isDisabled(
  currentPage: number,
  targetPage: number
) {
  if (currentPage === targetPage) {
    return "disabled"
  }
  return "";
}

/**
 * Renders a single pagination cell
 * @param props See IPaginationCell
 */
function PaginationCell(props: PaginationCellProps) {
  const pageText = def<string>(props.pageText, props.targetPage.toString());
  return (
    <BSPagination.Item className={props.className} onClick={() => {props.setPage(props.targetPage);}}>
      {pageText}
    </BSPagination.Item>
  );
}

/**
 * Renders pagination and handles pagination-related actions
 * @param props see IPagination
 */
function Pagination(props: PaginationProps) {
  const useOffset = def<boolean>(props.useOffset, false);
  const perPage = min(props.pageState.perPage, 1);
  const maxPage = Math.ceil(props.pageState.totalCount / perPage);

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

    // Render current page
    renderedCells.push(
      <PaginationCell
        key="page_current"
        className="active"
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
      }

      targetPage = props.pageState.currentPage + i;
      if (targetPage <= maxPage) {
        renderedCells.push(<PaginationCell key={"page_" + targetPage} targetPage={targetPage} setPage={setPage}/>);
      }
    }

    // Render first
    renderedCells.unshift(
      <PaginationCell 
        className={isDisabled(props.pageState.currentPage, 1)} 
        key="page_first"
        pageText="First"
        targetPage={1}
        setPage={setPage}/>
    );

    // Render last
    renderedCells.push(
      <PaginationCell 
        className={isDisabled(props.pageState.currentPage, maxPage)} 
        key="page_last"
        pageText="Last"
        targetPage={maxPage}
        setPage={setPage}/>
    );

    return renderedCells;
  }

  const cells = renderCells();

  return (
    <BSPagination>
      {cells}
    </BSPagination>
  );
}

export default Pagination;
