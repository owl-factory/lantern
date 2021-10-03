import { RulesetDocument } from "types/documents";
import { rest } from "utilities/request";
import { RulesetManager } from "../managers";
import { DataController } from "./DataController";

class $RulesetController extends DataController<RulesetDocument> {
  /**
   * Updates the isPublic field of a ruleset
   *
   * @param id The ID of the Ruleset to update
   * @param isPublic The new isPublic value
   * @returns The updated ruleset
   */
  public async updateIsPublic(id: string, isPublic: boolean) {
    const isPublicEndpoint = `/api/rulesets/${id}/public`;
    if (!this.isUserLoggedIn()) {
      // TODO - alert controller
      return;
    }
    const result = await rest.patch<{ruleset: RulesetDocument}>(isPublicEndpoint, { isPublic });
    if (!result.success) {
      // TODO - alert controller
      return;
    }
    RulesetManager.set(result.data.ruleset);
    return result.data.ruleset;
  }
}

export const RulesetController = new $RulesetController(RulesetManager, "/api/rulesets");
