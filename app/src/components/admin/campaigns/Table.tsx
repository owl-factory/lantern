import { TableBuilder } from "../../../utilities/design/table";
import Table from "../../design/tables/Table";
import { PageState } from "../../design/Pagination";

export interface CampaignTableProps {
  campaigns: any; // Campaign model TODO
  pageState: PageState;
}

const tableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Campaign", "name")
.addDataColumn("Alias", "alias")
.addDataColumn("Publish Type", "publishType")
.addDataColumn("Published", "isPublished", (isPublished: boolean) => (isPublished ? "Yes" : "No"))
// .addComponentColumn("Tools", );

/**
 * Renders a table containing campaigns
 * 
 * @param props.campaigns An array of campaigns to render in a table
 * @param props.pageState The page state with page, perPage, and total count
 */
export function CampaignTable(props: any) {
  return <Table 
    {...tableBuilder.renderConfig()} 
    data={props.campaigns} 
    startingIncrement={(props.pageState.page - 1) * props.pageState.perPage + 1}
  />
}