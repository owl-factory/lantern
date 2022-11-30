// The different types of View that can be created and dynamically rendered
export enum ViewType {
  ActorSheet, // View used for rendering an interactive sheet for actors
  ContentSheet, // View used for rendering out all of the minute details for a piece of content
  ContentSearch, // View used for searching through a particular content type
  ContentResult, // View used for a result from a content search
}
