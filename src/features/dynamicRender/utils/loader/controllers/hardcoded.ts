import { ValidationController } from "../../validation";
import { action, computed, safeMakeObservable } from "lib/mobx";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { LoaderController, LoaderControllerState, MarkupSource } from "features/dynamicRender/types/controllers/loader";

/**
 * A Controller for fetching markup that is stored at a static HTTP location
 */
export class HardcodedLoaderController extends ValidationController implements LoaderController {
  _state: LoaderControllerState = LoaderControllerState.NoOp;
  markup = "<Sheet></Sheet>";
  apiRoute: string;

  constructor(options: FactoryOptions) {
    super();

    if (options.markupSource !== MarkupSource.Hardcoded) {
      return this;
    }

    this.apiRoute = options.uri;

    const obserableResult = safeMakeObservable(this, {
      ready: computed,
      setState: action,
    });

    if (obserableResult.ok === false) {
      console.error(obserableResult.error);
      this.setState(LoaderControllerState.MobxError);
      return this;
    }

    this.setState(LoaderControllerState.Ready);
  }

  get ready() {
    if (this._state === LoaderControllerState.Ready || this._state === LoaderControllerState.Fetching) {
      return true;
    }
    return false;
  }

  /**
   * Updates the state within a specific action so that MobX can watch
   * @param state - The new state
   */
  setState(state: LoaderControllerState) {
    this._state = state;
  }

  /**
   * Loads all asynchronous or synchonous data and concludes any setup
   */
  async load(): Promise<void> {
    await this.fetch();
  }

  /**
   * Fetches the markup from the hardcoded location
   */
  async fetch(): Promise<void> {
    // TODO - abort the previous fetch if this one is still operating
    this.setState(LoaderControllerState.Fetching);
    const markupResponse = await fetch(this.apiRoute);

    if (!markupResponse.ok) {
      this.setState(LoaderControllerState.FetchFailed);
      // TODO - store/log error
      return;
    }

    this.markup = await markupResponse.text();
    this.setState(LoaderControllerState.Ready);
  }

  /**
   * Validates the current Markup Controller
   */
  validate() {
    switch (this._state) {
      case LoaderControllerState.NoOp:
        this.errors.push("The Markup Controller has not been initialized.");
        break;
    }
    return;
  }
}
