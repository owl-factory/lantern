import CoreResolver from "./CoreResolver";
import {  ContentTypeModel } from "../../types";

/**
 * The resolver for CRUD operations on the ContentType model.
 */
export class ContentTypeResolver extends CoreResolver {
  public static model = ContentTypeModel;
}
