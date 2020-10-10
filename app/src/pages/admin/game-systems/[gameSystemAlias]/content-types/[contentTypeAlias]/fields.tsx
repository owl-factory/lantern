import React from "react";
import Page from "../../../../../../components/design/Page";
import Breadcrumbs from "../../../../../../components/design/Breadcrumbs";
import { NextPageContext } from "next";
import gql from "graphql-tag";
import { client } from "../../../../../../utilities/graphql/apiClient";
import { Row, Col, Button } from "react-bootstrap";
import { TableBuilder } from "../../../../../../utilities/design/table";
import Table from "../../../../../../components/design/tables/Table";

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

function ContentTypeFieldTable(props: any) {
  return (
    <Table
      {...tableBuilder.renderConfig()}
      data={[{name: "Level", type: "Number", default: 0}]}
      rowAction={props.rowAction}
    />
  );
}

function ContentTypeFieldForm(props: any) {
  return (
    <>Content Type Field Form {props.activeField ? `# ${props.activeField}` : ""}</>
  );
}

export default function ContentTypeFields({ contentType, gameSystem }: any) {
  const [ fields, setFields ] = React.useState(contentType.fields);
  const [ activeField, setActiveField ] = React.useState<number | null>(null);

  function rowAction(index: number) {
    setActiveField(index - 1);
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

      {/* Global Actions */}
      <Button>Save</Button>

      <Row>
        <Col xs={8}><ContentTypeFieldTable rowAction={rowAction} fields={fields}/></Col>
        <Col xs={4}><ContentTypeFieldForm activeField={activeField} fields={fields}/></Col>
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