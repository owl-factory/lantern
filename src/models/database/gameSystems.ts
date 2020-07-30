import Model from "./model";

/**
 * Defines the structure of a game system object
 * @param name The name of the game system
 * @param key The key of the game system, used in urls
 * @param description A brief description of the game system
 * @param isUserCreated True if created by a non-admin user, false otherwise
 * @param ownerID The id of the creating user, null if created by the admin section
 * @param defaultModuleID The default module of this game system containing standard rules and content
 * @param isPublished True if this is published for the public to see, false otherwise
 * @param isPurchasable True if a user must purchase this before using
 * @param cost The cost in cents of this game system
 * @param defaultThemeID The default theme to use for this game system when playing or viewing content, unless overridden
 */
export default interface GameSystemModel extends Model {
  name?: string;
  key?: string;
  description?: string;
  isUserCreated?: boolean;
  ownerID?: string;
  defaultModuleID?: string;
  isPublished?: boolean;
  isPurchasable?: boolean;
  cost?: number;
  defaultThemeID?: string;
}