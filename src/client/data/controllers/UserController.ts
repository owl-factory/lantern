import { UserDocument } from "types/documents";
import { UserManager } from "../managers";
import { DataController } from "./DataController";

class $UserController extends DataController<UserDocument> {
}

export const UserController = new $UserController(UserManager, "/api/users");
