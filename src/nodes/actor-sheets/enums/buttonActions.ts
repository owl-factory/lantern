// The possible actions that a button can perform
// NOTE: due to how these are assigned, they must all be in lowercase
export enum ButtonAction {
  Alert="alert",

  // Content manipulation
  CreateContent="createcontent",
  DeleteContent="deletecontent",

  None="none",
}
