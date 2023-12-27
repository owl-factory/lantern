import { StorageController } from "features/dynamicRender/types/storage";

/**
 * A null class that implements the StorageController in the event no other
 * StorageController is defined
 */
export class NullStorageController implements StorageController {
  isValid() {
    return false;
  }
  get() {
    return undefined;
  }

  update() {}
}
