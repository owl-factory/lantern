import { StorageController } from "features/dynamicRender/types/controllers/storage";
import { ValidationController } from "../../validation";

/**
 * A null class that implements the StorageController in the event no other
 * StorageController is defined
 */
export class NullStorageController extends ValidationController implements StorageController {
  async load() {}
  validate() {
    this.errors.push("No Storage Controller was created");
  }

  get() {
    return undefined;
  }

  update() {
    return false;
  }
}
