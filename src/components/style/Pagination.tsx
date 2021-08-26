import React from "react";

interface PaginationProps {
  pageState: PageState; // The state of the page to use and update
  setPageState: (pageState: PageState) => (void); // Function to update the page state
}

// TODO - move to types!
export interface PageState {
  page: number; // The current page
  perPage: number; // The number of items per page
  totalCount: number; // The total number of items
}

interface PaginationCellProps {
  className?: string;
  targetPage: number; // The target page
  pageText?: string; // Alternate text to put on the link, eg "Last"
  setPage: (page: number) => (void); // Alternate text to put on the link, eg "Last"
  hasLink?: boolean; // Whether to have this as a link or a static button (eg for current page)
}

/**
 * Determines if the page navigation button is disabled
 * @param page The current page
 * @param targetPage The target page that the button would take us to
 */
function isDisabled(page: number, targetPage: number) {
  return page === targetPage ? "disabled" : "";
}

/**
 * Renders a single pagination cell
 * @param props See IPaginationCell
 */
function PaginationCell(props: PaginationCellProps) {
  const pageText = props.pageText || props.targetPage.toString();
  return (
    <li className={`page-item ${props.className}`} onClick={() => {props.setPage(props.targetPage);}}>
      {pageText}
    </li>
  );
}

/**
 * Renders pagination and handles pagination-related actions
 * @param props see PaginationProps
 */
export function Pagination(props: PaginationProps): JSX.Element {
  const perPage = (props.pageState.perPage >= 1) ? props.pageState.perPage : 1;
  let maxPage = Math.ceil((props.pageState.totalCount) / perPage);
  if (maxPage === 0) { maxPage = 1; } // Prevents issues with zero items

  /**
   * Sets the page and runs associated actions
   * @param page The page to set to
   */
  function setPage(page: number) {
    props.setPageState({...props.pageState, page: page, perPage});
  }

  /**
   * Renders the pagination cells
   */
  function renderCells() {
    const renderedCells: JSX.Element[] = [];
    const width = 3;

    // Render current page
    renderedCells.push(
      <PaginationCell
        key="page_current"
        className="active"
        targetPage={props.pageState.page}
        hasLink={false}
        setPage={setPage}
      />,
    );

    // Render side pages
    for (let i = 1; i < width; i++) {
      let targetPage: number = props.pageState.page - i;
      if (targetPage > 0) {
        renderedCells.unshift(<PaginationCell key={"page_" + targetPage} targetPage={targetPage} setPage={setPage}/>);
      }

      targetPage = props.pageState.page + i;
      if (targetPage <= maxPage) {
        renderedCells.push(<PaginationCell key={"page_" + targetPage} targetPage={targetPage} setPage={setPage}/>);
      }
    }

    // Render first
    renderedCells.unshift(
      <PaginationCell
        className={isDisabled(props.pageState.page, 1)}
        key="page_first"
        pageText="First"
        targetPage={1}
        setPage={setPage}/>
    );

    // Render last
    renderedCells.push(
      <PaginationCell
        className={isDisabled(props.pageState.page, maxPage)}
        key="page_last"
        pageText="Last"
        targetPage={maxPage}
        setPage={setPage}/>
    );

    return renderedCells;
  }

  const cells = renderCells();

  // TODO - add aria-label
  return ((maxPage > 1) ?
    (
      <nav>
        <ul className="pagination">
          {cells}
        </ul>
      </nav>
    ):
    <></>
  );
}

export default Pagination;
