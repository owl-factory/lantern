import { action, computed, observable, safeMakeObservable } from "lib/mobx";
import { FactoryOptions } from "features/dynamicRender/types/factory";
import { MarkupControllerState, Prefabs } from "features/dynamicRender/types/controllers/markup";
import { MarkupController } from "./common";

/**
 * A MarkupController in which the Markup is expected to remain static and unchanging
 * throughout the lifetime of the controller
 */
export class StaticMarkupController extends MarkupController {
  state = MarkupControllerState.NoOp;

  _layout: Element;
  _prefabs: Prefabs;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_options: FactoryOptions) {
    super();

    const mobxResult = safeMakeObservable(this, {
      ready: computed,
      state: observable,
      setState: action,
    });

    if (mobxResult.ok === false) {
      console.error(mobxResult.error);
      this.setState(MarkupControllerState.MobxError);
      return this;
    }
    this.setState(MarkupControllerState.Initialized);
  }
}
