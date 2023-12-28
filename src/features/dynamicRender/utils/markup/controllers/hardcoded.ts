import { MarkupController, MarkupControllerState, Prefabs, Variables } from "features/dynamicRender/types/markup";
import { ValidationController } from "../../validation";
import { parseMarkup } from "../parse";
import { action, makeObservable, observable } from "lib/mobx";

/**
 * A Markup Controller for accessing a markup file stored locally within this code
 * TODO - This should be a generic Static or Dynamic Markup controller, with its own dependency "MarkupLoadingController"
 */
export class HardcodedMarkupController extends ValidationController implements MarkupController {
  state = MarkupControllerState.NoOp;
  apiRoute: string;

  _layout: Element;
  _variables: Variables;
  _prefabs: Prefabs;

  constructor() {
    super();

    this.apiRoute = "/characters/mockfinder.xml";

    try {
      makeObservable(this, {
        state: observable,
        setState: action,
        load: action,
      });
    } catch (why) {
      console.error(why);
      this.setState(MarkupControllerState.MobxError);
      return this;
    }
  }

  /**
   * Updates the state within a specific action so that MobX can watch
   * @param state - The new state
   */
  setState(state: MarkupControllerState) {
    this.state = state;
  }

  get layout() {
    return this._layout;
  }

  /**
   * Loads the markup file from an endpoint, parses it, and sets the parsed components
   */
  async load() {
    this.setState(MarkupControllerState.Loading);

    const markupResponse = await fetch(this.apiRoute);
    if (!markupResponse.ok) {
      this.state = MarkupControllerState.FetchFailed;
      return;
    }

    const markup = await markupResponse.text();
    const parsedMarkupResult = parseMarkup(markup);
    if (parsedMarkupResult.ok === false) {
      this.setState(MarkupControllerState.ParseFailed);
      console.error(parsedMarkupResult.error);
      return;
    }

    const { layout, variables, prefabs } = parsedMarkupResult.data;

    this._layout = layout;
    this._variables = variables;
    this._prefabs = prefabs;

    this.setState(MarkupControllerState.Ready);
  }

  get ready() {
    return this.state === MarkupControllerState.Ready;
  }

  /**
   * Validates the current Markup Controller
   */
  validate() {
    switch (this.state) {
      case MarkupControllerState.NoOp:
        this.errors.push("The Markup Controller has not been initialized.");
        break;
      case MarkupControllerState.FetchFailed:
        this.errors.push(`The fetch to ${this.apiRoute} failed.`);
        break;
      case MarkupControllerState.ParseFailed:
        this.errors.push(`The parsing of the markup document failed.`);
        break;
    }
    return;
  }
}
