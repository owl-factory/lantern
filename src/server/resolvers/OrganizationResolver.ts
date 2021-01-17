import { CoreDocument, OrganizationModel } from "../../types/documents";
import { Context } from "../../types/server";
import CoreResolver from "./CoreResolver";

export class OrganizationResolver extends CoreResolver {
  public static model = OrganizationModel;

  public static createOne(data: CoreDocument, ctx?: Context) {
    // TODO - Does name already exist?
    return super.createOne(data, ctx);
  }
}