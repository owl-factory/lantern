import { MarkupController, MarkupControllerState, Prefabs, Variables } from "features/dynamicRender/types/markup";
import { ValidationController } from "../../validation";
import { parseMarkup } from "../parse";

/**
 * A Markup Controller for accessing a markup file stored locally within this code
 */
export class HardcodedMarkupController extends ValidationController implements MarkupController {
  state: MarkupControllerState;
  apiRoute: string;

  _layout: Element;
  _variables: Variables;
  _prefabs: Prefabs;

  constructor() {
    super();
    this.apiRoute = "/characters/mockfinder.xml";
    this.state = MarkupControllerState.NoOp;
  }

  /**
   * Loads the markup file from an endpoint, parses it, and sets the parsed components
   */
  async load() {
    this.state = MarkupControllerState.Loading;

    const markupResponse = await fetch(this.apiRoute);
    if (!markupResponse.ok) {
      this.state = MarkupControllerState.FetchFailed;
      return;
    }

    const markup = await markupResponse.text();
    const parsedMarkupResult = parseMarkup(markup);
    if (parsedMarkupResult.ok === false) {
      this.state = MarkupControllerState.ParseFailed;
      console.error(parsedMarkupResult.error);
      return;
    }

    const { layout, variables, prefabs } = parsedMarkupResult.data;

    this._layout = layout;
    this._variables = variables;
    this._prefabs = prefabs;

    this.state = MarkupControllerState.Ready;
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
