import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { Button, Card, Col, FormGroup, FormLabel, Row } from "react-bootstrap";
import { ErrorMessage, Input } from "../../../components/design/forms/Forms";
import Modal from "../../../components/design/Modal";
import Page from "../../../components/design/Page";
import Pagination, { PageState } from "../../../components/design/Pagination";
import Table from "../../../components/design/tables/Table";
import { TableBuilder } from "../../../utilities/design/table";
import { formatOptions } from "../../../utilities/options";
import request from "../../../utilities/request";

// Props used for the create organization modal
interface CreateOrganizationModalProps {
  handleClose: () => void;
  modal: boolean;
}

// Props used for the Organization Search component
interface OrganizationSearchProps {
  setFilters: (filters: Record<string, string>) => void;
}

// Builds the context for the organizations table
const tableBuilder = new TableBuilder()
  .addIncrementColumn("")
  .addDataColumn("Organization", "name", { sortable: true });

/**
 * Renders the Create Organization form
 */
function CreateOrganizationForm() {
  const router = useRouter();
  const [ errors, setErrors ] = React.useState({});

  /**
   * Validates the data, then saves it to the database
   * @param values The form values to save to the database
   */
  async function onSubmit(values: Record<string, string>) {
    const response = await request.post("/api/admin/organizations/new", values);
    if (response.errors) {
      setErrors(response.errors);
      return;
    }

    // Set success and wait?
    // Redirect
    router.push(`/admin/organizations/${response.organization._id}`);
  }

  return (
    <Formik
      initialErrors={ errors }
      initialValues={ { name: "" } }
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          {/* Name, Publish Level, Organization, description */}
          <Row>
            <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Organization</FormLabel>
              <Input name="name"/>
              <ErrorMessage name="name"/>
            </FormGroup>
          </Row>

          <Button type="submit">Submit!</Button>
        </Form>
      )}
    </Formik>
  )
}

/**
 * Renders the modal containing the Create Organization Form
 * @param props.modal A boolean whether the modal is open or not
 * @param props.handleClose A function that handles closing the modal
 */
function CreateOrganizationModal(props: CreateOrganizationModalProps) {
  return (
    <Modal open={props.modal} handleClose={props.handleClose}>
      <Card>
        <Card.Header>Create a New Organization</Card.Header>
        <Card.Body>
          <CreateOrganizationForm/>
        </Card.Body>
      </Card>
    </Modal>
  );
}

/**
 * Renders the form that allows for filtering and searching of organizations
 * @param setFilters The function to set the filters from the search and send the request
 */
function OrganizationSearch(props: OrganizationSearchProps) {
  const [ errors, setErrors ] = React.useState({});

  return (
    <Formik
      initialErrors={ errors }
      initialValues={ { name: "" } } // Need to ensure these are kept when changing pages
      onSubmit={props.setFilters}
    >
      {() => (
        <Form>
          <Row>
          <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Organization Name</FormLabel>
              <Input name="name.like" placeholder="Search..."/>
              <ErrorMessage name="name.like"/>
            </FormGroup>
          </Row>

          <Button type="submit">Submit!</Button>
        </Form>
      )}
    </Formik>
  );
}

/**
 * Renders The admin page for managing organizations
 * @param props.organizations An initial array of organizations to display in a table
 */
export default function Organizations(props: any) {
  const [ filters, setFilters ] = React.useState({} as Record<string, string>);
  const [ pageState, setPageState ] = React.useState({
    page: 1, 
    perPage: 25,
    totalCount: props.organizationCount
  });
  const [ sortBy, setSortBy ] = React.useState("");

  const [ organizations, setOrganizations ] = React.useState(props.organizations);
  const [ modal, setModal ] = React.useState(false);

  /**
   * Handles closing the modal
   */
  function handleClose() { setModal(false); }

  /**
   * Fetches organizations from the API based on the given filters
   * @param newFilters The filters to search by
   * @param newPageState the page state for filtering
   * @param newSortBy The key to sort by
   */
  async function fetchOrganizations(
    newFilters: Record<string, string>,
    newPageState: PageState,
    newSortBy: string
  ) {
    const options = formatOptions(newPageState, newSortBy);
    const results = await request.post("/api/admin/organizations", {
      filters: newFilters,
      options
    });

    if (results.error) { return; }
    console.log(results)
    setOrganizations(results.organizations);
    if (pageState.totalCount != results.organizationCount) { 
      setPageState({...pageState, totalCount: results.organizationCount});
    }
  }

  /**
   * Fetches new organizations and sets the new filters
   * @param newFilters New filters for searching organizations
   */
  async function setNewFilters(newFilters: Record<string, string>) {
    await fetchOrganizations(newFilters, pageState, sortBy);
    setFilters(newFilters);
  }

  /**
   * Fetches organizations from changes in the page state
   * @param newPageState The new page state to find organizations
   */
  async function setPage(newPageState: PageState) {
    await fetchOrganizations(filters, newPageState, sortBy);
    setPageState(newPageState);
  }

  /**
   * Fetches the organizations based on changes in the sorting
   * @param newSortBy The new key to sort by
   */
  async function setNewSortBy(newSortBy: string) {
    await fetchOrganizations(filters, pageState, newSortBy);
    setSortBy(newSortBy);
  }

  return (
    <Page>
      <h1>Organizations</h1>

      {/* Create Organization */}
      <Button onClick={() => {setModal(true)}}>New Organization</Button>

      {/* Search */}
      <OrganizationSearch setFilters={setNewFilters}/>

      {/* Organization Table */}
      <Table
        {...tableBuilder.renderConfig()}
        data={organizations}
        sortBy={sortBy}
        setSortBy={setNewSortBy}
        startingIncrement={(pageState.page - 1) * pageState.perPage + 1}
      />

      {/* Pagination */}
      <Pagination pageState={pageState} setPageState={setPage}/>

      {/* Modal */}
      <CreateOrganizationModal modal={modal} handleClose={handleClose}/>
    </Page>
  )
}

/**
 * Fetches all initial data for the organization
 */
Organizations.getInitialProps = async () => {
  const response = await request.post("/api/admin/organizations", {});
  return {
    organizations: response.organizations,
    organizationCount: response.organizationCount
  }
}