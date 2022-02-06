import { Role } from "@owl-factory/auth/types";
import { getUniques } from "@owl-factory/utilities/arrays";
import { permissions } from "./permissions";

const defaultPermissions: string[] = [];
const playerPermissions: string[] = [
  "viewMyCampaigns",
  "createCampaign",
  "editMyCampaign",
  "deleteMyCampaign",

  "createCharacter",
  "deleteMyCharacter",
  "viewMyCharacters",
  "viewGameCharacters",
  "editMyCharacter",
  "searchMyCharacters",

  "viewContent",
  "searchMyContent",

  "viewContentType",

  "createExternalImage",
  "searchMyImages",

  "searchOfficialAndPublicRulesets",

  "createScene",

  "viewUser",
  "searchByUsername",
  "updateMyUser",
];

const adminPermissions: string[] = getUniques(permissions, "key");

export const roles: Record<string, Role> = {
  default: { key: "default", name: "Default", permissions: defaultPermissions },
  player: { key: "player", name: "Player", permissions: playerPermissions },
  admin: { key: "admin", name: "Admin", permissions: adminPermissions },
};
