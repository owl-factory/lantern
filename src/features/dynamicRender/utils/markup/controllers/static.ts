import { MarkupController, MarkupControllerState, Prefabs, Variables } from "features/dynamicRender/types/markup";
import { action, computed, observable, safeMakeObservable } from "lib/mobx";
import { ValidationController } from "../../validation";
import { MarkupLoaderController } from "features/dynamicRender/types/markupLoader";
import { NullMarkupLoaderController } from "./loaders/null";
import { parseMarkup } from "../parse";
import { Ok } from "utils/functional";
import { Result } from "types/functional";
import { HardcodedMarkupLoaderController } from "./loaders/hardcoded";

/**
 * A MarkupController in which the Markup is expected to remain static and unchanging
 * throughout the lifetime of the controller
 */
export class StaticMarkupController extends ValidationController implements MarkupController {
  state = MarkupControllerState.NoOp;
  loader: MarkupLoaderController = new NullMarkupLoaderController();

  _layout: Element;
  _variables: Variables;
  _prefabs: Prefabs;

  constructor() {
    super();

    this.loader = new HardcodedMarkupLoaderController();

    const obserableResult = safeMakeObservable(this, {
      ready: computed,
      state: observable,
      setState: action,
    });

    if (obserableResult.ok === false) {
      console.error(obserableResult.error);
      this.setState(MarkupControllerState.MobxError);
      return this;
    }
    this.load();
  }

  get ready(): boolean {
    if (this.state !== MarkupControllerState.Ready) return false;
    if (!this.loader.ready) return false;
    return true;
  }

  /**
   * Updates the state within a specific action so that MobX can watch
   * @param state - The new state
   */
  setState(state: MarkupControllerState) {
    this.state = state;
  }

  /**
   * Loads the markup from the LoaderController
   */
  async load(): Promise<Result<void, string>> {
    this.setState(MarkupControllerState.Loading);
    const markupResult = await this.loader.load();

    if (markupResult.ok === false) {
      this.setState(MarkupControllerState.FetchFailed);
      return markupResult;
    }

    const markup = markupResult.data;
    const parsedMarkupResult = parseMarkup(markup);
    if (parsedMarkupResult.ok === false) {
      this.setState(MarkupControllerState.ParseFailed);
      return parsedMarkupResult;
    }

    const { layout, variables, prefabs } = parsedMarkupResult.data;

    this._layout = layout;
    this._variables = variables;
    this._prefabs = prefabs;

    this.setState(MarkupControllerState.Ready);
    return Ok(undefined);
  }

  /** Getter for the layout */
  get layout() {
    return this._layout;
  }

  validate() {
    switch (this.state) {
      case MarkupControllerState.NoOp:
        this.errors.push("The Markup Controller has not been initialized.");
        break;
      case MarkupControllerState.ParseFailed:
        this.errors.push(`The parsing of the markup document failed.`);
        break;
    }
  }
}
