import { read } from "@owl-factory/utilities/objects";
import { action, makeObservable, observable } from "mobx";
import { RulesetDocument } from "types/documents";
import { StaticVariable } from "types/documents/subdocument/StaticVariable";

interface RulesetControllerItem {
  name: string; // The name of the ruleset
  alias: string; // The name of the alias
  actorFields: Record<string, unknown>; // The actor fields
  staticVariables: Record<string, StaticVariable>; // The custom, static variables
}

// An empty default ruleset
const EMPTY_RULESET: RulesetControllerItem = {
  name: "Test Ruleset",
  alias: "test",
  actorFields: {},
  staticVariables: {},
};

// The types of variables stored within the ruleset
export enum RuleVariableGroup {
  STATIC="static",
}

export class RulesetController {
  public nullID = "temp"; // The null ID
  public $rulesets: Record<string, RulesetControllerItem> = {};

  constructor() {
    this.$rulesets[this.nullID] = EMPTY_RULESET;

    makeObservable(this, {
      $rulesets: observable,
      loadRuleset: action,
    });
  }

  /**
   * Gets a single ruleset stored within the controller
   * @param ref The ref of the ruleset to fetch
   * @returns The found ruleset. If none is found, returns the null ID ruleset
   */
  public getRuleset(ref: string): RulesetControllerItem {
    const ruleset = this.$rulesets[ref];
    if (!ruleset) { return this.$rulesets[this.nullID]; }
    return ruleset;
  }

  /**
   * Gets a variable from the ruleset
   * @param ref The ref of the ruleset to get a variable for
   * @param variableGroup The variable group to pull the value from
   * @param field The field to get the value for
   * @returns A value, if found. Undefined otherwise
   */
  public getRulesetVariable(ref: string, variableGroup: RuleVariableGroup, field: string): unknown {
    console.log(ref, variableGroup, field)
    const ruleset = this.getRuleset(ref);
    switch (variableGroup) {
      case RuleVariableGroup.STATIC:
        const staticField = ruleset.staticVariables;
        const value = read(staticField, field);
        if (!value) { return undefined; }
        return (value as any).value;
    }
  }

  /**
   * Loads in a ruleset
   * @param ref The ref of the ruleset to be loaded in
   * @param ruleset The ruleset to be loaded in
   */
  public loadRuleset(ref: string, ruleset: Partial<RulesetDocument>) {
    const rules: RulesetControllerItem = {
      name: ruleset.name || "Unknown",
      alias: ruleset.alias || "unknown",
      actorFields: ruleset.actorFields || {},
      staticVariables: ruleset.staticVariables || {},
    };
    this.$rulesets[ref] = rules;
  }

  /**
   * Unloads a ruleset from the controller
   * @param ref The ref of the ruleset to unload
   * @returns True if a ruleset was found before being unloaded, false if there was none
   */
  public unloadRuleset(ref: string): boolean {
    // Skip the unloading process if this is the null ruleset
    if (ref === this.nullID) { return false; }

    const ruleset = this.$rulesets[ref];
    delete this.$rulesets[ref];
    return ruleset !== undefined;
  }
}
