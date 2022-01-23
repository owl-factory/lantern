import { Permission } from "@owl-factory/auth/types";
import { Collection } from "src/fauna";

// TODO - this might be better in a more configurable format?
export const permissions: Permission[] = [
  { key: "viewMyCampaigns", name: "View My Campaigns", collection: Collection.Campaigns },
  { key: "viewAllCampaigns", name: "View All Campaigns", collection: Collection.Campaigns },
  { key: "createCampaign", name: "Create a Campaign", collection: Collection.Campaigns },
  { key: "editMyCampaign", name: "Edit Played Campaign", collection: Collection.Campaigns },
  { key: "editAnyCampaign", name: "Edit Any Campaign", collection: Collection.Campaigns },
  { key: "deleteMyCampaign", name: "Delete My Campaign", collection: Collection.Campaigns },
  { key: "deleteAnyCampaign", name: "Delete Any Campaign", collection: Collection.Campaigns },

];
