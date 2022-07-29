export enum DataSource {
  Actor, // The raw scalar data mapping to fields within an actor sheet
  Content, // An actor's expandable non-scalar data, such as their inventory or attacks
  Ruleset, // A variable specifically from the ruleset
  Sheet, // A variable created by and used within the sheet
}
