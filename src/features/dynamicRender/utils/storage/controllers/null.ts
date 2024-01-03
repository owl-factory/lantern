import { StorageControllerState } from "features/dynamicRender/types/controllers/storage";
import { StorageController } from "./common";

/**
 * A null class that implements the StorageController in the event no other
 * StorageController is defined
 */
export class NullStorageController extends StorageController {
  async load() {
    this.setState(StorageControllerState.FetchFailed, "No loading has been implemented!");
  }

  get() {
    return undefined;
  }

  update() {
    return false;
  }
}
