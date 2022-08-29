export enum DataSource {
  Actor="character", // The raw scalar data mapping to fields within an actor sheet
  Content="content", // An actor's expandable non-scalar data, such as their inventory or attacks
  Ruleset="rules", // A variable specifically from the ruleset
  Sheet="sheet", // A variable created by and used within the sheet
}
