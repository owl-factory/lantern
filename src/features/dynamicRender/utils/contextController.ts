import { FactoryOptions } from "../types/factory";
import { MarkupController } from "../types/markup";
import { StorageController } from "../types/storage";
import { NullMarkupController } from "./markup/controllers/null";
import { MarkupFactory } from "./markup/factory";
import { NullStorageController } from "./storage/controllers/null";
import { StorageFactory } from "./storage/factory";

/**
 * A class used to manage the context for DynamicRender, as well as handling some
 * shared functionality between the different controllers
 */
export class ContextController {
  markup: MarkupController;
  storage: StorageController;

  constructor(options?: FactoryOptions) {
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
}
