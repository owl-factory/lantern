import { action, computed, safeMakeObservable } from "lib/mobx";
import { MarkupControllerState, Prefabs } from "features/dynamicRender/types/controllers/markup";
import { MarkupController } from "./common";

/**
 * A MarkupController in which the Markup is expected to remain static and unchanging
 * throughout the lifetime of the controller
 */
export class StaticMarkupController extends MarkupController {
  _state = MarkupControllerState.NoOp;

  _prefabs: Prefabs = {};

  constructor() {
    super();

    const mobxResult = safeMakeObservable(this, {
      ready: computed,
      setState: action,
    });

    if (mobxResult.ok === false) {
      this.setState(MarkupControllerState.MobxError, mobxResult.error);
      return this;
    }
    this.setState(MarkupControllerState.Initialized);
  }
}
