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
import request from "../../../utilities/request";

/**
 * Renders the Create Organization form
 */
function CreateOrganizationForm(props: any) {
  const router = useRouter();
  const [ errors, setErrors ] = React.useState({});

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
function CreateOrganizationModal(props: any) {
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
 * @param props 
 */
function OrganizationSearch(props: any) {
  const [ errors, setErrors ] = React.useState({});

  function onSubmit(values: Record<string, string>) {
    props.setFilters({ search: values });

  }

  return (
    <Formik
      initialErrors={ errors }
      initialValues={ { name: "" } } // Need to ensure these are kept when changing pages
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <Row>
            <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Organization Name</FormLabel>
              <Input name="name" placeholder="Search..."/>
              <ErrorMessage name="name"/>
            </FormGroup>
          </Row>

          <Button type="submit">Submit!</Button>
        </Form>
      )}
    </Formik>
  );
}

interface SearchFilters {
  pageState: PageState;
  search: Record<string, string>
}

interface PartialSearchFilters {
  pageState?: PageState;
  search?: Record<string, string>
}



const tableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Organization", "name", { sortable: true })

/**
 * Renders The admin page for managing organizations
 * @param props.organizations An initial array of organizations to display in a table
 */
export default function Organizations(props: any) {
  const [ modal, setModal ] = React.useState(false);
  const [ filters, setFilters ] = React.useState({} as Record<string, string>);
  const [ pageState, setPageState ] = React.useState({
    page: 1, 
    perPage: 25,
    totalCount: props.organizationCount
  });
  const [ sortBy, setSortBy ] = React.useState("");

  const [ organizations, setOrganizations ] = React.useState(props.organizations);
  const [ errors, setErrors ] = React.useState("");

  function handleClose() { setModal(false); }

  async function fetchOrganizations(
    newFilters: Record<string, string>,
    newPageState: PageState,
    newSortBy: string
  ) {
    const results = await request.post("/api/admin/organizations", {
      filters: newFilters,
      pageState: newPageState,
      sortBy: newSortBy,
    });
    console.log(results)
    setOrganizations(results.organizations);
    if (pageState.totalCount != results.organizationCount) { 
      setPageState({...pageState, totalCount: results.organizationCount});
    }
  }

  /**
   * 
   * @param newFilters A partial new filter that updates the current selection of 
   */
  async function setNewFilters(newFilters: Record<string, string>) {
    await fetchOrganizations(newFilters, pageState, sortBy);
    setFilters(newFilters);
  }

  async function setPage(newPageState: PageState) {
    await fetchOrganizations(filters, newPageState, sortBy);
    setPageState(newPageState);
  }

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
      <OrganizationSearch 
        setOrganizations={setOrganizations}
        setFilters={setNewFilters}
      />

      {/* Organization Table */}
      <Table
        {...tableBuilder.renderConfig()}
        data={organizations}
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