import { action, computed, observable, safeMakeObservable } from "lib/mobx";
import { FactoryOptions } from "../types/factory";
import { StorageController } from "../types/controllers/storage";
import { NullMarkupController } from "./markup/controllers/null";
import { MarkupFactory } from "./markup/factory";
import { NullStorageController } from "./storage/controllers/null";
import { StorageFactory } from "./storage/factory";
import { GetOptions, QuerySource, SetOptions } from "../types/query";
import { LoaderController } from "../types/controllers/loader";
import { LoaderFactory } from "./loader/factory";
import { NullLoaderController } from "./loader/controllers/null";
import { parseMarkup } from "./markup/parse";
import { MarkupController } from "./markup/controllers/common";

enum ContextState {
  /** Nothing has been done; the controller is uninitialized */
  NoOp,

  // Working
  /** The controller has been initialized */
  Initialized,
  /** The controller is loading data, async and otherwise */
  Loading,
  /** The controller is ready to use and operating correctly */
  Ready,

  // Errors
  // Recoverable
  /** The markup failed to parse correctly */
  ParsingError,

  // Unrecoverable
  /** MobX encountered an error while initializing */
  MobxError,
}

/**
 * A class used to manage the context for DynamicRender, as well as handling some
 * shared functionality between the different controllers
 */
export class ContextController {
  _state: ContextState = ContextState.NoOp;

  loader: LoaderController = new NullLoaderController();
  markup: MarkupController = new NullMarkupController();
  storage: StorageController = new NullStorageController();

  constructor(options?: FactoryOptions) {
    // Allows for a null default controller in the base render context
    if (options === undefined) return this;

    const mobxResult = safeMakeObservable(this, {
      ready: computed,
      _state: observable,
      setState: action,
    });
    if (mobxResult.ok === false) {
      this.setState(ContextState.MobxError);
      return this;
    }

    const loaderController = LoaderFactory.build(options);
    const markupController = MarkupFactory.build(options);
    const storageController = StorageFactory.build(options);

    this.loader = loaderController;
    this.markup = markupController;
    this.storage = storageController;

    this.setState(ContextState.Initialized);
  }

  /**
   * Sets a new state to mark this as an action for MobX
   * @param state - The new state
   */
  setState(state: ContextState) {
    this._state = state;
  }

  get ready(): boolean {
    return this._state === ContextState.Ready;
  }

  /**
   * Runs any necessary setup functions on the component mount.
   * If this controller is not in the Initialized state, nothing is done.
   */
  async load() {
    const initialized = this._state === ContextState.Initialized;
    if (!initialized) return;

    await Promise.all([this.loader.load(), this.markup.load(), this.storage.load()]);

    // TODO - check that this is ready

    const parseResult = parseMarkup(this.loader.markup);
    if (parseResult.ok === false) {
      console.error("Parsing failed...", parseResult.error);
      this.setState(ContextState.ParsingError);
      return;
    }

    const { layout, prefabs } = parseResult.data;
    this.markup.setData({ layout, prefabs });
    this.setState(ContextState.Ready);
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
