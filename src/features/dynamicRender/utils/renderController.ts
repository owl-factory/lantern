import { action, computed, observable, safeMakeObservable } from "lib/mobx";
import { NullMarkupController } from "./markup/controllers/null";
import { NullStorageController } from "./storage/controllers/null";
import { NullLoaderController } from "./loader/controllers/null";
import { MarkupController } from "./markup/controllers/common";
import { LoaderController } from "./loader/controllers/common";
import { StorageController } from "./storage/controllers/common";
import { LoaderFactory, MarkupFactory, StorageFactory } from "./factory";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { GetOptions, QuerySource } from "features/dynamicRender/types/query";
import { parseMarkup } from "features/dynamicRender/utils/markup/parseSheet";
import { WebWorker } from "features/webWorker";

/** The valid states of the Render Controller */
export enum RenderControllerState {
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
 * A class used to manage Dynamicing Rendering, as well as handling some
 * shared functionality between the different controllers
 */
export class RenderController {
  _state: RenderControllerState = RenderControllerState.NoOp;
  _error: string | undefined;

  loader: LoaderController = new NullLoaderController();
  markup: MarkupController = new NullMarkupController();
  storage: StorageController = new NullStorageController();

  constructor(options?: FactoryOptions) {
    // Allows for a null default controller in the base render context
    if (options === undefined) return this;

    const mobxResult = safeMakeObservable(this, {
      ready: computed,
      _state: observable,
      _setState: action,
    });
    if (mobxResult.ok === false) {
      this._setState(RenderControllerState.MobxError);
      return this;
    }

    const loaderController = LoaderFactory.build(options);
    const markupController = MarkupFactory.build(options);
    const storageController = StorageFactory.build(options);

    this.loader = loaderController;
    this.markup = markupController;
    this.storage = storageController;

    this._setState(RenderControllerState.Initialized);
  }

  /**
   * Sets a new state to mark this as an action for MobX
   * @param state - The new state
   */
  _setState(state: RenderControllerState, error?: string) {
    this._state = state;
    this._error = error;
  }

  get ready(): boolean {
    return this._state === RenderControllerState.Ready;
  }

  /**
   * Runs any necessary setup functions on the component mount.
   * If this controller is not in the Initialized state, nothing is done.
   */
  async load() {
    const initialized = this._state === RenderControllerState.Initialized;
    if (!initialized) return;

    await Promise.all([this.loader.load(), this.markup.load(), this.storage.load()]);

    // TODO - check that this is ready

    const parseResult = parseMarkup(this.loader.markup);
    if (parseResult.ok === false) {
      this._setState(RenderControllerState.ParsingError, `Parsing failed: ${parseResult.error}`);
      return;
    }

    const { layout, prefabs } = parseResult.data;
    this.markup.setData({ layout, prefabs });
    this._setState(RenderControllerState.Ready);
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
      case QuerySource.Self:
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
  update<T>(options: GetOptions, value: T): boolean {
    return this.storage.update(options, value);
  }
}
