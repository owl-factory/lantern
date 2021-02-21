import { Formik, Form } from "formik";
import React from "react";
import { Button, Card, Col, FormGroup, FormLabel, Row } from "react-bootstrap";
import Modal from "../../components/design/Modal";
import Page from "../../components/design/Page";
// import * as Yup from "yup";
import { ErrorMessage, Input, Select } from "../../components/design/forms/Forms";
import request from "../../utilities/request";
import { MdPageview, MdInfo, MdBuild, MdBlock } from "react-icons/md";
import ContextMenu from "../../components/design/contextMenus/ContextMenu";
import { TableComponentProps } from "../../types/design/table";
import { ContextMenuBuilder } from "../../utilities/design/contextMenu";
import { TableBuilder } from "../../utilities/design/table";
import { Ruleset } from "../../types/documents";
import Table from "../../components/design/tables/Table";
import Pagination, { PageState } from "../../components/design/Pagination";
import { Options } from "../../types/inputs/options";


/**
 * Renders the form to create a new game system.
 */
function CreateRulesetForm() {
  const [ errors, setErrors ] = React.useState({name: "Oh hai error"});

  /**
   * Runs the submit action of the create game system form and handles
   * the success and failure results
   * @param values The values from the form to submit
   */
  async function onSubmit(values: Record<string, string>) {
    const response = await request.post(
      "/api/rulesets",
      values
    );
    console.log(response);
    
  }

  return (
    <Formik
      initialErrors={ errors }
      initialValues={ {} }
      onSubmit={onSubmit}
      // validationSchema={Yup.object({
      //   name: Yup.string()
      //     .required("Required")
      //     .max(100, "Maximum of 100 characters"),
      //   alias: Yup.string()
      //     .max(20, "Maximum of 20 characters"),
      // })}
    >
      {() => (
        <Form>
          {/* Just name for now */}
          <Row>
            <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Ruleset Name</FormLabel>
              <Input name="name"/>
              <ErrorMessage name="name"/>
            </FormGroup>
          </Row>

          <Button type="submit">Submit!</Button>
        </Form>
      )}
    </Formik>
  );
}

function RulesetModal({ handleClose, modal }: { handleClose: () => void, modal: boolean }) {
  return (
    <Modal open={modal} handleClose={handleClose}>
      <Card>
        <Card.Header>Create a New Rule Set</Card.Header>
        <Card.Body>
          <CreateRulesetForm/>
        </Card.Body>
      </Card>
    </Modal>
  );
}

const initialPerPage = 1;
const gameSystemActions = new ContextMenuBuilder()
  .addLink("Details", MdInfo, "/rulesets/[alias]")
  .addLink("Edit", MdBuild, "/rulesets/[alias]/edit")
  .addItem("Delete", MdBlock, (context: Ruleset) => (confirm(`Are you sure you want to delete ${context.name}?`)));

const tableBuilder = new TableBuilder()
  .addIncrementColumn("")
  .addDataColumn("Ruleset", "name")
  .addComponentColumn("Tools", RulesetActions);

/**
 * Renders the actions for the game systems page
 * @param props A game system object
 */
function RulesetActions({ data }: TableComponentProps) {
  return (
    <ContextMenu
      context={{name: data.name, alias: data.alias || data._id}}
      {...gameSystemActions.renderConfig()}
    />
  );
}

async function queryRulesets(page: number, perPage: number, filters?: Record<string, string>) {
  const res = await request.get("/api/rulesets", filters || {});
  if (res.success) { return res.data; }
  return { rulesets: [], rulesetCount: 0 };
}

export default function Rulesets({ initialRulesets, rulesetCount }: any): JSX.Element {
  const [ rulesets, setRulesets ] = React.useState(initialRulesets);
  const [ modal, setModal ] = React.useState(false);
  function handleClose() { setModal(false); }

  const [pageState, setPageState] = React.useState({
    page: 1,
    perPage: initialPerPage,
    totalCount: rulesetCount,
  });

  async function setPage(newPageState: PageState) {
    const newRulesetData = await queryRulesets(
      newPageState.page,
      newPageState.perPage
    );

    setRulesets(newRulesetData.rulesets);
    setPageState({...newPageState, totalCount: newRulesetData.rulesetCount});
  }


  return (
    <Page>
      <h1>Rulesets</h1>
      {/* Create Ruleset */}
      <Button onClick={() => { setModal(true); }}>New Ruleset</Button>
      <RulesetModal modal={modal} handleClose={handleClose}/>
      {/* Search & Filters */}
      {/* Table */}
      <Table
        {...tableBuilder.renderConfig()}
        data={rulesets}
        startingIncrement={(pageState.page - 1) * pageState.perPage + 1}
      />
      <Pagination pageState={pageState} setPageState={setPage}/>
    </Page>
  );
}

Rulesets.getInitialProps = async () => {
  const res = await request.get("/api/rulesets", { options: { limit: 1 }} );
  return { initialRulesets: res.data.rulesets, rulesetCount: res.data.rulesetCount };
};
