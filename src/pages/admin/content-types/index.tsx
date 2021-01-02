import React from "react";
import { TableBuilder } from "../../../utilities/design/table";
import Page from "../../../components/design/Page";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Table from "../../../components/design/tables/Table";
import Pagination, { PageState } from "../../../components/design/Pagination";
import { Button } from "react-bootstrap";
import Link from "next/link";
import { MdBuild, MdInfo } from "react-icons/md";
import ContextMenu from "../../../components/design/contextMenus/ContextMenu";
import { CommonContentType } from "../../../types/documents/CommonContentType";
import { ContextMenuBuilder } from "../../../utilities/design/contextMenu";
import { ContentType } from "../../../types/documents";

interface CommonContentTypeIndexProps {
  initialContentTypes: CommonContentType[];
  contentTypeCount: number;
}

const initialPerPage = 25;
const contentTypeActions = new ContextMenuBuilder()
  .addLink("Details", MdInfo, "/admin/content-types/[alias]")
  .addLink("Edit", MdBuild, "/admin/content-types/[alias]/edit");

/**
 * Renders the actions for the content types table
 * @param props A game system object
 */
function ContentTypeActions(props: {data: CommonContentType}) {
  // View, Details, Edit, Modules

  return (
    <ContextMenu
      context={{name: props.data.name, alias: props.data.alias || props.data._id}}
      {...contentTypeActions.renderConfig()}
    />
  );
}

const tableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Content Type", "name")
.addDataColumn("Alias", "alias")
.addComponentColumn("Tools", ContentTypeActions);

async function queryContentTypes(page: number, perPage: number) {
  
  return [ [],  0 ];
}

/**
 * Renders a table with entities
 * @param props.contentTypes An array of entities of to render into a table
 * @param props.pageState A page state containing page and perPage
 */
export default function CommonContentTypeIndex(
  { initialContentTypes, contentTypeCount }: CommonContentTypeIndexProps
): JSX.Element {
  const [ contentTypes, setContentTypes ] = React.useState(initialContentTypes);
  const [ pageState, setPageState ] = React.useState({
    page: 1,
    perPage: initialPerPage,
    totalCount: contentTypeCount,
  });

  async function setPage(newPageState: PageState) {
    const [ newContentTypes, newContentCount ] = await queryContentTypes(
      newPageState.page,
      newPageState.perPage
    );

    newPageState.totalCount = newContentCount as number;

    setContentTypes(newContentTypes as ContentType[]);
    setPageState(newPageState);
  }


  return (
    <Page>
      <h1>Search Common Content Types</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Content Types"]}/>
      <Button >
        <Link href="/admin/content-types/new">
          <a>+ Add Common Content Types</a>
        </Link>
      </Button>

      <Table
        {...tableBuilder.renderConfig()}
        data={contentTypes as Record<string, unknown>[]}
        startingIncrement={(pageState.page - 1) * pageState.perPage + 1}
      />
      <Pagination pageState={pageState} setPageState={setPage}/>

    </Page>
  );
}

CommonContentTypeIndex.getInitialProps = async () => {
  const [ initialContentTypes, contentTypeCount ] = await queryContentTypes(1, initialPerPage);
  return {
    initialContentTypes,
    contentTypeCount,
  };
};
