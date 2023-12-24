import { action, makeObservable, observable } from "mobx";

/**
 * Describes the different kinds of button modes that may be used
 */
 export enum MapMode {
  Select,
  Pan,
}

/**
 * The readable text for the different scene modes
 */
 export const MapModeReadable: string[] = [
  "Select",
  "Pan",
];

/**
 * The buttons to be used for selecting the scene modes (not implemented)
 */
export const MapModeButtons: string[] = [
  "v",
  " ",
];

class $ModeController {
  public mode: MapMode;

  constructor() {
    this.mode = MapMode.Select;

    makeObservable(this, {
      mode: observable,
      setMode: action,
    });
  }

  /**
   * Sets the new mode for determining how the user can interact with the map
   * @param mode The new mode to utilize
   */
  public setMode(mode: MapMode) {
    this.mode = mode;
    // TODO - actions on mode change
  }
}

export const ModeController = new $ModeController();
