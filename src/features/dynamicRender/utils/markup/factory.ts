import { FactoryOptions } from "features/dynamicRender/types/factory";
import { NullMarkupController } from "./controllers/null";
import { StaticMarkupController } from "./controllers/static";
import { MarkupController } from "./controllers/common";
import { MarkupServeType } from "features/dynamicRender/types/controllers/markup";

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
    switch (options.markupServeType) {
      case MarkupServeType.Static:
        return new StaticMarkupController(options);
    }

    return new NullMarkupController();
  }
}
