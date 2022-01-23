import { AuthController } from "@owl-factory/auth/AuthController";
import { UserDocument } from "types/documents";

export const Auth = new AuthController<UserDocument>();
