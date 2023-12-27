import { FactoryOptions } from "features/dynamicRender/types/factory";
import { MarkupController, MarkupSource } from "features/dynamicRender/types/markup";
import { NullMarkupController } from "./controllers/null";
import { HardcodedMarkupController } from "./controllers/hardcoded";

/**
 * A factory that builds the appropriate Markup controller
 */
export class MarkupFactory {
  /**
   * Identifies and builds the appropriate Markup Controller for the given options
   * @param options - The factory options to determine the appropriate controller to build
   * @returns A MarkupController
   */
  static build(options: FactoryOptions): MarkupController {
    switch (options.markupSource) {
      case MarkupSource.Hardcoded:
        return new HardcodedMarkupController();
    }

    return new NullMarkupController();
  }
}
