import { CommonFaunaData, DocumentModel } from "./Model";

/**
 * The user object for the user's core data for use with NextAuth
 */
export interface UserData extends CommonFaunaData {
  
}

export class UserModel extends DocumentModel {
  
}