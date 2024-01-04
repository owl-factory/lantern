import { TargetType } from "features/dynamicRender/types/targetType";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { StorageType } from "features/dynamicRender/types/controllers/storage";
import { StorageController } from "./storage/controllers/common";
import { LocalStorageController } from "./storage/controllers/localStorage";
import { NullStorageController } from "./storage/controllers/null";
import { MarkupServeType } from "../types/controllers/markup";
import { MarkupController } from "./markup/controllers/common";
import { NullMarkupController } from "./markup/controllers/null";
import { StaticMarkupController } from "./markup/controllers/static";
import { MarkupSource } from "../types/controllers/loader";
import { LoaderController } from "./loader/controllers/common";
import { HardcodedLoaderController } from "./loader/controllers/hardcoded";

/** Builds a LoaderController for fetching Markup from a source */
export class LoaderFactory {
  static build(options: FactoryOptions): LoaderController {
    switch (options.markupSource) {
      case MarkupSource.Hardcoded:
        return new HardcodedLoaderController(options);
    }
  }
}

/** A factory that builds the appropriate Markup controller */
export class MarkupFactory {
  /**
   * Identifies and builds the appropriate Markup Controller for the given options
   * @param options - The factory options to determine the appropriate controller to build
   * @returns A MarkupController
   */
  static build(options: FactoryOptions): MarkupController {
    switch (options.markupServeType) {
      case MarkupServeType.Static:
        return new StaticMarkupController();
    }

    return new NullMarkupController();
  }
}

/** A factory that builds a StorageController appropriate to the current options */
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
        return new LocalStorageController(options.targetId);
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
