import React from "react";
import { TableBuilder } from "../../../utilities/design/table";
import Page from "../../../components/design/Page";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import gql from "graphql-tag";
import { client } from "../../../utilities/graphql/apiClient";
import Table from "../../../components/design/tables/Table";
import Pagination, { PageState } from "../../../components/design/Pagination";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { MdBuild, MdInfo } from "react-icons/md";
import ContextMenu from "../../../components/design/contextMenus/ContextMenu";
import { CommonContentType } from "@reroll/model/dist/documents/CommonContentType";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";

const initialPerPage = 25;
const entityTypeActions = new ContextMenuBuilder()
  .addLink("Details", MdInfo, "/admin/entity-types/[alias]")
  .addLink("Edit", MdBuild, "/admin/entity-types/[alias]/edit")

/**
 * Renders the actions for the content types table
 * @param props A game system object
 */
function EntityTypeActions(props: CommonContentType) {
  // View, Details, Edit, Modules
  const urlKey = props.alias || props._id;

  return (
    <ContextMenu 
      context={{name: props.name, alias: props.alias || props._id}} 
      {...entityTypeActions.renderConfig()}
    />
  );
}

const tableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Entity Type", "name")
.addDataColumn("Alias", "alias")
// .addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
.addComponentColumn("Tools", EntityTypeActions);

async function queryEntityTypes(page: number, perPage: number) {
  const query = gql`query {
    commonEntityTypes (skip: ${(page - 1) * perPage}, limit: ${perPage}) {
      _id,
      name,
      alias
    },
    commonEntityTypeCount
  }`;

  const { data } = await client.query({query});

  return [ data.commonEntityTypes,  data.commonEntityTypeCount ];
}

/**
 * Renders a table with entity types
 * @param props.entityTypes An array of entity types of to render into a table
 * @param props.pageState A page state containing page and perPage
 */
export default function CommonEntityTypeIndex({ initialEntityTypes, entityTypeCount }: any) {
  const [ contentTypes, setContentTypes ] = React.useState(initialEntityTypes);
  const [ pageState, setPageState ] = React.useState({
    page: 1,
    perPage: initialPerPage,
    totalCount: entityTypeCount
  });

  async function setPage(newPageState: PageState) {
    const [ newEntityTypes, newEntityTypeCount ] = await queryEntityTypes(
      newPageState.page, 
      newPageState.perPage
    );

    newPageState.totalCount = newEntityTypeCount;

    setContentTypes(newEntityTypes);
    setPageState(newPageState);
  }


  return (
    <Page>
      <h1>Search Common Entity Types</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Entity Type"]}/>
      <Button >
        <Link href="/admin/entity-types/new">
          <a>+ Add Common Entity Types</a>
        </Link>
      </Button>

      <Table 
        {...tableBuilder.renderConfig()} 
        data={contentTypes} 
        startingIncrement={(pageState.page - 1) * pageState.perPage + 1}
      />
      <Pagination pageState={pageState} setPageState={setPage}/>

    </Page>
  );
}

CommonEntityTypeIndex.getInitialProps = async () => {
  const [ initialEntityTypes, entityTypeCount ] = await queryEntityTypes(1, initialPerPage);
  return { 
    initialEntityTypes,
    entityTypeCount
  };
};