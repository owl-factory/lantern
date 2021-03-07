import { ModuleModel } from "..";
import { CoreResolver } from "./CoreResolver";

/**
 * The resolver for CRUD operations on the Module model.
 */
export class ModuleResolver extends CoreResolver {
  public static model = ModuleModel;
}
