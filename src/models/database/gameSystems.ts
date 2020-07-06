/* eslint-disable @typescript-eslint/no-inferrable-types */
import Model from "./model";

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