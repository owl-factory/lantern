import React from "react";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import { TableBuilder } from "../../../../../../utilities/design/table";
import Table from "../../../../../../components/design/tables/Table";
import { ContentTypeField, ContentFieldType } from "@reroll/model/dist/documents/ContentType";
import * as Yup from "yup";
import { Form as FormikForm, Formik } from "formik";
import { Error, Input } from "../../../../../../components/design/forms/Forms";

// TODO - flesh these out
const fieldTypes = [
  {key: "text", value: "Text"},
  {key: "text", value: "Text"},
  {key: "boolean", value: "True/False"},
  {key: "options", value: "Select"},
];

const tableBuilder = new TableBuilder()
  .addDataColumn("Variable Name", "name")
  .addDataColumn("Type", "type")
  .addDataColumn("Default Value", "default")
  

function ContentTypeFieldForm(props: any) {
  if (props.fieldState.activeField === null) { return <><br/></>; };

  const field = {...props.fieldState.fields[props.fieldState.activeField]};

  function saveField(values: any) {
    const newFields = [...props.fieldState.fields];
    newFields.splice(props.fieldState.activeField, 1);
    newFields.push(values);
    newFields.sort(compareContentTypeFields);

    props.setFieldState({
      ...props.fieldState,
      activeField: null,
      fields: newFields,
      newField: false
    });
  }

  return (
    <Formik 
      initialValues={field}
      onSubmit={saveField}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Required")
          .min(2, "Minimum of 2 characters")
          .max(100, "Maximum of 100 characters")
          .matches(/^[a-z][a-z0-9\_\-]+$/, "Must start with a letter and contain only lowercase letters, numbers, dashes, and underscores"),
      })}
    >
      {(formProps: any) => (
        <FormikForm>
          <Button variant="primary" type="submit">Save</Button>

          <Form.Group>
            <Form.Label>Variable Name</Form.Label>
            <Input name="name" />
            <Error name="name"/>
          </Form.Group>

          {/* TODO - make select */}
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Input name="type" />
            <Error name="type"/>
          </Form.Group>

          <Form.Group>
            <Form.Label>Default Value</Form.Label>
            <Input name="default" />
            <Error name="default"/>
          </Form.Group>
        </FormikForm>
      )}
    </Formik> 
  );
}
  

function ContentTypeFieldTable(props: any) {
  return (
    <Table
      {...tableBuilder.renderConfig()}
      data={props.fields}
      rowAction={props.rowAction}
    />
  );
}

/**
 * Compares two content type fields to determine which order they belong in sorting
 * by their variable names
 * @param a The first content type field to evaluate
 * @param b The second content type field to evaluate
 */
function compareContentTypeFields(a: any, b: any) {
  if (a.name > b.name) { return 1; }
  else if (a.name < b.name) { return -1; }
  console.log("Same name error :(")
  return 0;
}

interface FieldState {
  fields: ContentTypeField[];
  activeField: number | null;
  newField: boolean;
  warning: string;
}

export default function ContentTypeFields({ contentType, gameSystem }: any) {
  const [ fieldState, setFieldState ] = React.useState<FieldState>({
    fields: contentType.fields, 
    activeField: null,
    newField: false,
    warning: ""
  });

  function rowAction(activeField: number | null) {
    if (activeField !== null ) { activeField -= 1; };
    if (fieldState.newField) { return; };
    if (activeField === fieldState.activeField) { return; }
    setFieldState({...fieldState, activeField});
  }

  function newField() {
    if (fieldState.newField) {
      setFieldState({
        ...fieldState, 
        warning: "A new variable is already being edited. Please save before creating a new one"
      });
      return;
    }

    const newField = {
      name: "_new_variable",
      type: 0,
      default: ""
    };
    const newFields = [...fieldState.fields];
    newFields.push(newField);
    newFields.sort(compareContentTypeFields);

    // Variables cannot start with _ normally, so we can assert that this will be
    // at the top of this function
    setFieldState({...fieldState, fields: newFields, activeField: 0, newField: true});
  }

  return (
    <Page>
      <h1>Edit {contentType.name} Fields</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Game Systems",
        gameSystem.name,
        "Content Types",
        contentType.name,
        "Edit Fields"
      ]}/>

      <div>{fieldState.warning}</div>

      {/* Global Actions */}
      <Button onClick={() => (newField())}>New Field</Button>
      <Button>Save</Button>

      <Row>
        <Col xs={8}>
          <ContentTypeFieldTable
            rowAction={rowAction}
            fields={fieldState.fields}
          />
        </Col>
        <Col xs={4}>
          <Card>
            <ContentTypeFieldForm
              fieldState={fieldState}
              setFieldState={setFieldState}
            />
          </Card>
        </Col>
      </Row>
      
    </Page>
  );
}

ContentTypeFields.getInitialProps = async (ctx: NextPageContext) => {
  const { gameSystemAlias, contentTypeAlias } = ctx.query;

  const query = gql`query {
    contentType (_id: "${contentTypeAlias}", gameSystemID: "${gameSystemAlias}") {
      _id, 
      name,
      alias,
      fields {
        name,
        type,
        default,
        readonly
      }
    },
    gameSystem (_id: "${gameSystemAlias}") {
      _id, 
      name,
      alias
    }
  }`;

  const { contentType, gameSystem } = (await client.query({query})).data;
  return { contentType, gameSystem };
}