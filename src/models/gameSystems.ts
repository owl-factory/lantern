/* eslint-disable @typescript-eslint/no-inferrable-types */
import Common from "./common";

export default interface GameSystem extends Common {
  name: string;
  key: string;
  description: string;
  isUserCreated: boolean;
  ownerID: string;
  defaultModuleID: string;
  isPublished: boolean;
  isPurchasable: boolean;
  cost: number;
  defaultThemeID: string;
}