import React from "react";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";
import { Row, Col, Button, Card, Form } from "react-bootstrap";
import { TableBuilder } from "../../../../../../utilities/design/table";
import Table from "../../../../../../components/design/tables/Table";
import { ContentTypeField } from "@reroll/model/dist/documents/ContentType";
import * as Yup from "yup";
import { Form as FormikForm, Formik } from "formik";
import { Error, Input, Select } from "../../../../../../components/design/forms/Forms";
import { ContentFieldTypeEnum, contentFieldTypes } from "@reroll/model/dist/enums/contentFieldType";

const tableBuilder = new TableBuilder()
  .addDataColumn("Variable Name", "name")
  .addDataColumn("Type", "type")
  .addDataColumn("Default Value", "default")

function renderGQLArray(array: any[]) {
  let gqlString = ``;
  array.forEach(item => {
    gqlString += `${renderGQL(item)},`
  });
  return `[${gqlString}]`;
}

function renderGQLObject(object: any) {
  console.log(object)
  let gqlString = ``;
  const keys = Object.keys(object);
  keys.forEach((key: string) => {
    gqlString += `${key}: ${renderGQL(object[key])},`;
  });

  return `{${gqlString}}`;
}

function renderGQL(object: any) {
  switch (typeof object) {
    case "string":
      return `"${object}"`;
    case "number":
    case "boolean":
      return `${object}`;
    case "object":
      if (Array.isArray(object)) {
        return renderGQLArray(object);
      }
      return renderGQLObject(object);
  }
  // throw new Error("No matching type")
}

/**
 * The state of the fields, controlling the functionality of the page
 */
interface FieldState {
  fields: ContentTypeField[]; // Fields of the content type that are being viewed
  activeField: number | null; // The currently active field, indicated by the array index. Nulls means nothing is displayed
  newField: boolean; // True if we're editing a new field. 
  warning: string; // A warning to display. Possibly move to a new state?
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
  return 0;
}

/**
 * Renders the form to modify the Content Type Field
 * @param props 
 */
function ContentTypeFieldForm(props: any) {
  if (props.fieldState.activeField === null) { return <><br/></>; };

  const field = {...props.fieldState.fields[props.fieldState.activeField]};

  /**
   * Saves a field to the fields array
   * @param values The form values of the field to save to the fields collection
   */
  function saveField(values: any) {
    const newFields = [...props.fieldState.fields];
    newFields.splice(props.fieldState.activeField, 1, values);
    newFields.sort(compareContentTypeFields);

    props.setFieldState({
      ...props.fieldState,
      activeField: null,
      fields: newFields,
      newField: false
    });
  }

  /**
   * Deletes a field
   * @param formProps Information passed in from the Formix form
   */
  function deleteField(formProps: any) {
    // Confirms that the form should be deleted
    const name = formProps.values.name;
    if(!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    // Does the same flow as the save action, without adding the new field back in
    const newFields = [...props.fieldState.fields];
    newFields.splice(props.fieldState.activeField, 1);
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
          <Button variant="primary" onClick={() => {deleteField(formProps)}}>Delete</Button>
          <Button variant="primary" type="submit">Save</Button>

          <Form.Group>
            <Form.Label>Variable Name</Form.Label>
            <Input name="name" />
            <Error name="name"/>
          </Form.Group>

          {/* TODO - make select */}
          <Form.Group>
            <Form.Label>Type</Form.Label>
              <Select 
                name="type"
                options={contentFieldTypes}
                labelKey="name"
                valueKey="value"
              />
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
  
/**
 * Renders a table containing the Content Type Fields for this specific of Content Type
 * @param props 
 */
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
 * Renders a page that allows for the editing of a content type's fields. 
 * @param contentType The content type that fields will be edited for
 * @param gameSystem The game system that this content type belongs to 
 */
export default function ContentTypeFields({ contentType, gameSystem }: any) {
  const [ fieldState, setFieldState ] = React.useState<FieldState>({
    fields: contentType.fields, 
    activeField: null,
    newField: false,
    warning: ""
  });

  /**
   * Sets the new active field, allowing for the viewing and editing of data
   * @param activeField The field to set to the active field
   */
  function selectActiveField(activeField: number | null) {
    if (activeField !== null ) { activeField -= 1; };
    if (fieldState.newField) { return; }; // Fail to switch if we're editing a new field
    if (activeField === fieldState.activeField) { return; }
    setFieldState({...fieldState, activeField});
  }

  /**
   * Creates a new field and sets it to the active field
   */
  function newField() {
    if (fieldState.newField) {
      setFieldState({
        ...fieldState, 
        warning: "A new variable is already being edited. Please save before creating a new one."
      });
      return;
    }

    const newField: ContentTypeField = {
      name: "_new_variable",
      type: ContentFieldTypeEnum.Text,
      default: ""
    };
    const newFields = [...fieldState.fields];
    newFields.push(newField);
    newFields.sort(compareContentTypeFields);

    // Variables cannot start with '_' normally, so we can assert that this will be
    // at the top of this function
    setFieldState({...fieldState, fields: newFields, activeField: 0, newField: true});
  }

  async function saveFields() {
    const mutation = gql`mutation {
      updateContentType (
        _id: "${contentType._id}",
        data: { fields: ${renderGQL(fieldState.fields)}}
      ) {
        ok, n
      }
    }`;

    console.log(mutation)

    const res = await client.mutate({mutation});

    console.log(res)
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
      <Button onClick={() => (saveFields())}>Save</Button>

      <Row>
        <Col xs={8}>
          <ContentTypeFieldTable
            rowAction={selectActiveField}
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