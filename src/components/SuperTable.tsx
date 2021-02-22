import { Form, Formik } from "formik";
import React from "react";
import { Col, FormGroup, FormLabel } from "react-bootstrap";
import { Input } from "./design/forms/Forms";

type updateFunction = (ı)

interface FilterProps {
  filters: Record<string, unknown>;
  update: 
}

function FilterSection({ filters, update, FilterContent}: any) {
  return (
    <Formik
      initialValues={ filters as Record<string, string> }
      onSubmit={async (values) => { await update({ filters: values }); }}
    >
      {() => (
        <Form>
          {/* Just name for now */}
          <div className="row">
            <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Ruleset Name</FormLabel>
              <Input name="name.like"/>
            </FormGroup>
          </div>

          <button className="btn" type="submit">Search!</button>
        </Form>
      )}
    </Formik>
  )
}

export function SuperTable(props: any) {
  const [ content, setContent ] = React.useState({})
  const [ filters, setFilters ] = React.useState(props.initialFilters || {});
  const [ pageState, setPageState ] = React.useState({
    page: 1,
    perPage: props.initialPerPage || 25,
    totalCount: props.initialContentCount,
  });
  const [ sort, setSort ] = React.useState(props.initialSort);

  /**
   * Fetches new content with changing filters and parameters.
   * @param newState An object containing any new information to fetch and save
   */
  function updateAll(newState: any) {
    const newContent = props.fetchContent(
      newState.filters || filters,
      newState.perPage || pageState.perPage,
      ((newState.page || pageState.page) - 1) * (newState.perPage || pageState.perPage),
      newState.sort || sort,
    );

    setContent(newContent.content);
    if (newState.filters) {
      setFilters(newState.filters);
      setPageState({...pageState, page: 1, totalCount: newContent.count});
    }
    if (newState.page || newState.perPage) {
      setPageState({
        ...pageState,
        page: newState.page || pageState.page,
        perPage: newState.perPage || pageState.perPage,
        totalCount: newContent.count,
      });
    }
    if (newState.sort) { setSort(newState.sort); }
  }
  


  return (
    <>
      <FilterSection/>
    </>
  );
}
