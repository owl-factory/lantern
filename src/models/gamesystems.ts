/* eslint-disable @typescript-eslint/no-inferrable-types */
import Common from "./common";

export default class Gamesystem extends Common {
  name: string = "";
  key: string = "";
  description?: string;
  ownerID?: string;
  modules: string[] = [];

}