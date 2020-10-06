import { TableBuilder } from "../../../utilities/design/table";
import Table from "../../design/tables/Table";
import { PageState } from "../../design/Pagination";

export interface EntityTableProps {
  contentTypes: any; // entity model TODO
  pageState: PageState;
}

const tableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Content Type", "name")
.addDataColumn("Alias", "alias")
// .addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
// .addComponentColumn("Tools", );

/**
 * Renders a table with entities
 * @param props.contentTypes An array of entities of to render into a table
 * @param props.pageState A page state containing page and perPage
 */
export function ContentTypeTable(props: EntityTableProps) {
  return <Table 
    {...tableBuilder.renderConfig()} 
    data={props.contentTypes} 
    startingIncrement={(props.pageState.page - 1) * props.pageState.perPage + 1}
  />
}