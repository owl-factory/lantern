import React from "react";
import { Form, Formik } from "formik";
import Table from "./Table";
import Pagination, { PageState } from "../Pagination";
import { TableBuilder } from "../../../utilities";
import { GenericDocumentType } from "../../../types";


interface newFilterState {
  filters?: Record<string, unknown>;
  page?: number;
  perPage?: number;
  sort?: string;
}

interface fetchContentResponse {
  // The new content fetched from the DB
  content: Record<string, unknown>[];
  // The total count of content records available
  contentCount: number;
}

// The function typing for fetching new content
type fetchContentFunction = (
  filters: Record<string, unknown>,
  limit: number,
  skip: number,
  sortBy: string
) => (fetchContentResponse)

// The props for the IndexTable
interface IndexTableProps {
  children: JSX.Element;
  content: Record<string, unknown>[] | GenericDocumentType[];
  contentCount: number;
  fetchContent: fetchContentFunction;
  filters: Record<string, unknown>;
  limit: number;
  sort: string;
  tableBuilder: TableBuilder;
}

/**
 * Renders a combined search, table, and pagination for content
 * @param children The search form
 * @param content The initial content to render in the table
 * @param contentCount The initial count of the content
 * @param fetchContent The function to fetch new content
 * @param filters The initial filters to use in the form
 * @param limit The initial content per-page
 * @param sort The initial sort to use
 * @param tableBuilder The tableBuilder class and config to build the table
 */
export function IndexTable(props: IndexTableProps): JSX.Element {
  const [ content, setContent ] = React.useState(props.content);
  const [ filters, setFilters ] = React.useState(props.filters || {});
  const [ pageState, setPageState ] = React.useState({
    page: 1,
    perPage: props.limit || 25,
    totalCount: props.contentCount,
  });
  const [ sort, setSort ] = React.useState(props.sort);

  function setNewPage(newPageState: PageState) {
    updateContent({ page: newPageState.page, perPage: newPageState.perPage });
  }
  function setNewSort(newSort: string) { updateContent({ sort: newSort }); }

  /**
   * Fetches new content with changing filters and parameters.
   * @param newState An object containing any new information to fetch and save
   */
  async function updateContent(newState: newFilterState): Promise<void> {
    // Fetches new content from the indextable filters
    const newContent = await props.fetchContent(
      newState.filters || filters,
      newState.perPage || pageState.perPage,
      ((newState.page || pageState.page) - 1) * (newState.perPage || pageState.perPage),
      newState.sort || sort,
    );

    // Updates the new content
    setContent(newContent.content);

    // Sets new IndexTable filters if they were updated
    if (newState.filters) {
      setFilters(newState.filters);
      setPageState({...pageState, page: 1, totalCount: newContent.contentCount});
    }
    if (newState.page || newState.perPage) {
      setPageState({
        ...pageState,
        page: newState.page || pageState.page,
        perPage: newState.perPage || pageState.perPage,
        totalCount: newContent.contentCount,
      });
    }
    if (newState.sort) { setSort(newState.sort); }
  }

  return (
    <>
      <Formik
        initialValues={ filters as Record<string, string> }
        onSubmit={async (values) => { await updateContent({ filters: values }); }}
      >
        {({ resetForm }) => (
          <Form>
            {props.children}
            <br/>
            <button
              className="btn btn-seconary"
              onClick={() => {resetForm(props.filters); updateContent({filters: props.filters});}}
            >
              Reset
            </button>
            <button className="btn btn-primary" type="submit">Search!</button>
          </Form>
        )}
      </Formik>
      <br/>
      <Table
        {...props.tableBuilder.renderConfig()}
        data={content}
        startingIncrement={(pageState.page - 1) * pageState.perPage + 1}
        sortBy={sort}
        setSortBy={setNewSort}
      />
      <Pagination pageState={pageState} setPageState={setNewPage}/>
    </>
  );
}
