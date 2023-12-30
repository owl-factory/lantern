import { computed, makeObservable } from "lib/mobx";
import { FactoryOptions } from "../types/factory";
import { MarkupController } from "../types/markup";
import { StorageController } from "../types/storage";
import { NullMarkupController } from "./markup/controllers/null";
import { MarkupFactory } from "./markup/factory";
import { NullStorageController } from "./storage/controllers/null";
import { StorageFactory } from "./storage/factory";
import { GetOptions, QuerySource, SetOptions } from "../types/query";

/**
 * A class used to manage the context for DynamicRender, as well as handling some
 * shared functionality between the different controllers
 */
export class ContextController {
  markup: MarkupController;
  storage: StorageController;

  constructor(options?: FactoryOptions) {
    makeObservable(this, {
      ready: computed,
    });

    if (options === undefined) {
      this.fromNull();
      return this;
    }

    const markupController = MarkupFactory.build(options);
    const storageController = StorageFactory.build(options);

    this.markup = markupController;
    this.storage = storageController;
  }

  /**
   * Creates a null-populated context controller
   */
  fromNull() {
    this.markup = new NullMarkupController();
    this.storage = new NullStorageController();
  }

  get ready(): boolean {
    return this.markup.ready && this.storage.ready;
  }

  /**
   * Runs any necessary setup functions on the component mount
   */
  async load() {
    await Promise.all([this.markup.load()]);
  }

  /**
   * Runs any necessary cleanup functions on component unmount
   */
  async unload() {}

  /**
   * Gets a single piece of data from the given options from the appropriate location
   * @param options - The options describing what data to get
   * @returns A value if found, or undefined if not
   */
  get<T>(options: GetOptions | string): T | undefined {
    if (typeof options === "string") return undefined;
    if (options.source === QuerySource.Invalid) return undefined;

    switch (options.source) {
      case QuerySource.Character:
        // case "content":
        return this.storage.get(options);
      // case "sheet":
      //   return undefined;
      default:
        return undefined;
    }
  }

  /**
   * Sets a single piece of data from the given options
   * @param options - The options describing what data to update
   * @returns True if the update was successful; false otherwise
   */
  update<T>(options: SetOptions<T>): boolean {
    return this.storage.update(options);
  }
}
