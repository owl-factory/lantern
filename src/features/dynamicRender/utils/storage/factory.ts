import { StorageController, StorageType } from "features/dynamicRender/types/storage";
import { TargetType } from "features/dynamicRender/types/targetType";
import { LocalStorageController } from "./localStorage";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { NullStorageController } from "./null";

/**
 * A factory that builds a StorageController appropriate to the current options
 */
export class StorageFactory {
  /**
   * Determines and builds the appropriate StorageController for the given options
   * @param options - The options that define the goal of the Dynamic Render
   * @returns A class that implements the StorageController interface
   */
  static build(options: FactoryOptions): StorageController {
    switch (options.targetType) {
      case TargetType.Character:
        return this.buildForCharacter(options);
      case TargetType.Content:
        return this.buildForContent(options);
    }
  }

  /**
   * Determines and builds the appropriate character-based StorageController for the given options
   * @param options - The options that define the goal of the Dynamic Render
   * @returns A class that implements the StorageController interface
   */
  static buildForCharacter(options: FactoryOptions): StorageController {
    switch (options.storageType) {
      case StorageType.LocalStorage:
        return new LocalStorageController(options.targetId, options.targetType);
    }
  }

  /**
   * Determines and builds the appropriate character-based StorageController for the given options
   * @param options - The options that define the goal of the Dynamic Render
   * @returns A class that implements the StorageController interface
   */
  static buildForContent(options: FactoryOptions): StorageController {
    options;
    return new NullStorageController();
  }
}
