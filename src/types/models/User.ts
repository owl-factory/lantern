import { CommonFaunaData, CoreDocument, DocumentModel, DocumentModelConfig } from "./Model";

/**
 * The user object for the user's core data for use with NextAuth
 */
export interface UserDocument extends CoreDocument {
  
}

export class UserModel extends DocumentModel implements UserDocument {
  public config: DocumentModelConfig = {};
  public collection = "users";
  
}