import { ModuleModel } from "../../types/documents/Module";
import CoreResolver from "./CoreResolver";

/**
 * The resolver for CRUD operations on the Module model.
 */
export class ModuleResolver extends CoreResolver {
  public static model = ModuleModel;
}
