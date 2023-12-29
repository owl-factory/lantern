import { ValidationController } from "../../../validation";
import { action, computed, observable, safeMakeObservable } from "lib/mobx";
import { MarkupLoaderController, MarkupLoaderControllerState } from "features/dynamicRender/types/markupLoader";
import { Err, Ok } from "utils/functional";
import { Result } from "types/functional";

/**
 * A Controller for fetching markup that is stored at a static HTTP location
 */
export class HardcodedMarkupLoaderController extends ValidationController implements MarkupLoaderController {
  state: MarkupLoaderControllerState = MarkupLoaderControllerState.NoOp;
  apiRoute: string;

  constructor() {
    super();

    this.apiRoute = "/characters/mockfinder.xml";

    const obserableResult = safeMakeObservable(this, {
      state: observable,
      setState: action,
    });

    if (obserableResult.ok === false) {
      console.error(obserableResult.error);
      this.setState(MarkupLoaderControllerState.MobxError);
      return this;
    }

    this.setState(MarkupLoaderControllerState.Ready);
  }

  get ready() {
    if (this.state === MarkupLoaderControllerState.Ready || this.state === MarkupLoaderControllerState.Fetching) {
      return true;
    }
    return false;
  }

  /**
   * Updates the state within a specific action so that MobX can watch
   * @param state - The new state
   */
  setState(state: MarkupLoaderControllerState) {
    this.state = state;
  }

  /**
   * Loads the markup file from an endpoint, parses it, and sets the parsed components
   */
  async load(): Promise<Result<string, string>> {
    // TODO - abort the previous fetch if this one is still operating
    this.setState(MarkupLoaderControllerState.Fetching);
    const markupResponse = await fetch(this.apiRoute);
    this.setState(MarkupLoaderControllerState.Ready);

    if (!markupResponse.ok) {
      return Err(`The markup fetch failed with code ${markupResponse.status}.`);
    }

    return Ok(await markupResponse.text());
  }

  /**
   * Validates the current Markup Controller
   */
  validate() {
    switch (this.state) {
      case MarkupLoaderControllerState.NoOp:
        this.errors.push("The Markup Controller has not been initialized.");
        break;
    }
    return;
  }
}
