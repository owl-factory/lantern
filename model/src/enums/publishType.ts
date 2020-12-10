/**
 * An enum for representing who is publishing something and where it is published
 */
export enum PublishType {
  Official = 0, // Offically published content
  ThirdParty, // Content that adds on to official content and (potentially) buyable
  Community, // Created by the community and searchable
  Private, // Private, personal content
}

export const publishTypeText = [
  "Official",
  "Third-Party",
  "Community",
  "Private",
];
