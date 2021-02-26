import React from "react";
import { Form, Formik } from "formik";
import Table from "./design/tables/Table";
import Pagination, { PageState } from "./design/Pagination";

interface FilterProps {
  filters: Record<string, unknown>;
  updateAll: (values: Record<string, unknown>) => (void);
  FilterContent: () => JSX.Element;
}

interface updateState {
  filters: Record<string, unknown>;
  page: number;
  perPage: number;
  sort: string;
}

/**
 * Renders the Filter section of the Super Table
 * @param filters The form containing the filters to initially render
 * @param updateAll The function to run when submitting the new filters
 * @param FilterContent The form fields to render
 */
function FilterSection({ filters, updateAll, FilterContent}: FilterProps) {
  return (
    <Formik
      initialValues={ filters as Record<string, string> }
      onSubmit={async (values) => { await updateAll({ filters: values }); }}
    >
      {() => (
        <Form>
          <FilterContent />

          <button className="btn btn-seconary">Reset</button>
          <button className="btn btn-primary" type="submit">Search!</button>
        </Form>
      )}
    </Formik>
  );
}

export function SuperTable(props: any): JSX.Element {
  const [ content, setContent ] = React.useState(props.content);
  const [ filters, setFilters ] = React.useState(props.initialFilters || {});
  const [ pageState, setPageState ] = React.useState({
    page: 1,
    perPage: props.perPage || 25,
    totalCount: props.contentCount,
  });
  const [ sort, setSort ] = React.useState(props.sort);

  function setNewPage(newPageState: PageState) {
    updateAll({ page: newPageState.page, perPage: newPageState.perPage });
  }
  function setNewSort(newSort: string) { updateAll({ sort: newSort }); }

  /**
   * Fetches new content with changing filters and parameters.
   * @param newState An object containing any new information to fetch and save
   */
  async function updateAll(newState: updateState) {
    const newContent = await props.fetchContent(
      newState.filters || filters,
      newState.perPage || pageState.perPage,
      ((newState.page || pageState.page) - 1) * (newState.perPage || pageState.perPage),
      newState.sort || sort,
    );


    setContent(newContent[props.contentKey]);
    if (newState.filters) {
      setFilters(newState.filters);
      setPageState({...pageState, page: 1, totalCount: newContent[props.countKey]});
    }
    if (newState.page || newState.perPage) {
      setPageState({
        ...pageState,
        page: newState.page || pageState.page,
        perPage: newState.perPage || pageState.perPage,
        totalCount: newContent[props.countKey],
      });
    }
    if (newState.sort) { setSort(newState.sort); }
  }

  return (
    <>
      <FilterSection filters={filters} updateAll={updateAll} FilterContent={props.FilterContent}/>
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
