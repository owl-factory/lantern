import react from "react";

interface IPagination {
  currentPage: number;
}

interface IPageState {
  currentPage: number;
  perPage: number;
  totalCount: number;
  offset: number;
}

interface IPagination {
  pageState: IPageState;
  setPage: (page: number) => void; // A callback for setting the page
}



export function usePageState(perPage: number = 25, totalCount: number = 0) {
  return react.useState({currentPage: 1, perPage, totalCount, offset: 0});
}

/**
 * Renders pagination and handles pagination-related actions
 * @param props see IPagination
 */
function Pagination(props: any) {
  return <div>1 2 3 4</div>;
}

export default Pagination;
