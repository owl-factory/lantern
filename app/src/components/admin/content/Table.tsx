import { TableBuilder } from "../../../utilities/design/table";
import Table from "../../design/tables/Table";
import { PageState } from "../../design/Pagination";

export interface ContentTableProps {
  content: any; // entity model TODO
  pageState: PageState;
}

const tableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Content", "name")
.addDataColumn("Alias", "alias")
.addDataColumn("Content Type", "")
// .addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
// .addComponentColumn("Tools", );

/**
 * Renders a table containing the content
 * @param props.content An array of content to render in the table
 * @param props.pageState The page state containing the page, perPage, and totalCount
 */
export function ContentTable(props: ContentTableProps) {
  return <Table 
    {...tableBuilder.renderConfig()} 
    data={props.content} 
    startingIncrement={(props.pageState.page - 1) * props.pageState.perPage + 1}
  />
}