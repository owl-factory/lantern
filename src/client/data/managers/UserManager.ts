import { UserDocument } from "types/documents";
import { rest } from "utilities/request";
import { DataManager } from "./DataManager";

export const UserManager = new DataManager<UserDocument>(
  "user"
);
