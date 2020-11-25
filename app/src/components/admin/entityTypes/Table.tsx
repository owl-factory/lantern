import { TableBuilder } from "../../../utilities/design/table";
import Table from "../../design/tables/Table";
import { PageState } from "../../design/Pagination";
import { EntityType } from "@reroll/model/dist/documents";

export interface EntityTableProps {
  entityTypes: EntityType[]; // entity model TODO
  pageState: PageState;
}

const tableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Entity Type", "name")
.addDataColumn("Alias", "alias");
// .addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
// .addComponentColumn("Tools", );

/**
 * Renders a table with entities
 * @param props.entities An array of entities of to render into a table
 * @param props.pageState A page state containing page and perPage
 */
export function EntityTypeTable(props: EntityTableProps): JSX.Element {
  return <Table
    {...tableBuilder.renderConfig()}
    data={props.entityTypes}
    startingIncrement={(props.pageState.page - 1) * props.pageState.perPage + 1}
  />;
}
