import { $SecurityController } from "@owl-factory/auth/security";
import { UserDocument } from "types/documents";

export const SecurityController = new $SecurityController<UserDocument>();
