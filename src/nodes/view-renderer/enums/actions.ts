// The possible actions that a button can perform
// NOTE: due to how these are assigned, they must all be in lowercase
export enum Action {
  Alert="alert",

  // SHEET INTERACTION //
  // Content manipulation
  CreateContent="createcontent",
  DeleteContent="deletecontent",

  ToggleCollapse="togglecollapse",

  // END SHEET INTERACTION //

  Roll="roll",

  None="none",
}
