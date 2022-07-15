import { action, makeObservable, observable } from "mobx";
import { RulesetDocument } from "types/documents";
import { ActorSheetDocument } from "types/documents/ActorSheet";
import { PageElementDescriptor } from "types/sheetElementDescriptors";
import { GenericSheetElementDescriptor, SheetVariableTuple } from "types/sheetElementDescriptors/generic";
import { SheetController } from "./ActorSheetController";
import { ActorSubController } from "./ActorSubController";
import { RuleVariableGroup, RulesetController } from "./RulesetController";

interface RenderGroup {
  actorRef: string;
  sheetRef: string;
  rulesetRef: string; // The actual ruleset, not the campaign
  // campaignRef: string;
}

/**
 * Handles rendering all actor sheets and populating them with data
 */
class $ActorController {
  public $renders: Record<string, RenderGroup> = {};

  protected actorController = new ActorSubController();
  protected rulesetController = new RulesetController();
  protected sheetController = new SheetController<Partial<ActorSheetDocument>>();

  constructor() {
    makeObservable(this, {
      $renders: observable,

      createRender: action,
    });
  }

  /**
   * Initializes a render by grouping together three different values so that accessing each value requires
   * only one unique value instead of three
   * @param actorRef The reference to the actor used in this render. If null, a temporary actor will be used instead
   * @param sheetRef The reference to the sheet used in this render
   * @param rulesetRef The reference to the ruleset used in this render. If null, empty values will be used instead
   * @returns The id used for accessing the elements of this render
   */
  public createRender(actorRef: string | null, sheetRef: string, rulesetRef: string | null): string {
    // Selects the ID. Defaults to actor, but falls back to the sheet if no actor is given
    const id = actorRef ? actorRef : sheetRef;
    if (!actorRef) { actorRef = "temp"; }
    if (!rulesetRef) { rulesetRef = "temp"; }
    this.$renders[id] = { actorRef, sheetRef, rulesetRef };

    return id;
  }

  /**
   * Loads an actor's sheet values into the controller
   * @param ref The ref of the actor being loaded in
   * @param actor The actor's values to load into the controller
   */
  public loadActor(ref: string, actor: Record<string, unknown>, force?: boolean): void {
    if (!force && this.actorController.isActorLoaded(ref)) { return; }
    this.actorController.loadActor(ref, actor);
  }

  /**
   * Loads in a sheet by taking the XML and converting it into usable objects
   * @param ref The sheet's reference string
   * @param sheetXML The raw sheet XML to load into the controller
   */
  public loadSheet(ref: string, sheetXML: string): void {
    this.sheetController.load(ref, sheetXML);
  }

  /**
   * Loads in the values of a ruleset combined with a campaign to accurately render an actor sheet
   * @param ref The ref of the ruleset
   * @param ruleset The combined values of the ruleset and campaign that may be accessed
   */
  public loadRuleset(ref: string, ruleset: Partial<RulesetDocument>): void {
    this.rulesetController.loadRuleset(ref, ruleset);
  }

  /**
   * Unloads a single actor
   * @param ref The ref of the actor to unload
   * @returns True if an actor was successfully unloaded, false if one is not found
   */
  public unloadActor(ref: string): boolean {
    return this.actorController.unloadActor(ref);
  }

  /**
   * Unloads a single ruleset
   * @param ref The ref of the ruleset to unload
   * @todo Implement
   * @returns True if a ruleset was successfully unloaded, false if one is not found
   */
   public unloadRuleset(ref: string): boolean {
    return this.rulesetController.unloadRuleset(ref);
  }

  /**
   * Unloads a single sheet
   * @param ref The ref of the sheet to unload
   * @returns True if a sheet was successfully unloaded, false if one is not found
   */
  public unloadSheet(ref: string): boolean {
    return this.sheetController.unload(ref);
  }

  /**
   * Gets an actor by their render ref
   * @param renderRef The ref of the render to check for the actor's true ref
   */
  public getActor(renderRef: string): Record<string, unknown> {
    let actorRef = "";
    if (this.$renders[renderRef]) { actorRef = this.$renders[renderRef].actorRef; }
    return this.actorController.getActorValues(actorRef);
  }

  /**
   * Gets the actor ref from the current render
   * @param renderRef The ref of the render to get the actor from
   * @returns The actor ref or the shared none ID
   */
  public getActorRef(renderRef: string): string {
    if (!this.$renders[renderRef]) { return "temp"; }
    const actorRef = this.$renders[renderRef].actorRef;
    return actorRef;
  }

  /**
   * Gets an actor by their render ref and the field
   * @param renderRef The ref of the render to check for the actor's true ref
   */
   public getActorField(renderRef: string, field: string): any {
    if (!this.$renders[renderRef]) { return undefined; }
    const actorRef = this.$renders[renderRef].actorRef;
    return this.actorController.getActorFieldValue(actorRef, field);
  }

  /**
   * Sets a single value within an actor by their render ref and the field
   * @param renderRef The ref of the render to check for the actor's true ref
   */
   public setActorField(renderRef: string, field: string, value: any) {
    if (!this.$renders[renderRef]) { return; }
    const actorRef = this.$renders[renderRef].actorRef;
    this.actorController.setActorFieldValue(actorRef, field, value);
  }

  /**
   * Grabs the sheet for the given render
   * @param ref The ref of the render to fetch the sheet for
   * @returns The found sheet
   */
  public getSheet(ref: string): PageElementDescriptor {
    let sheetRef = "";
    if (this.$renders[ref]) { sheetRef = this.$renders[ref].sheetRef; }
    return this.sheetController.getSheet(sheetRef);
  }

  /**
   * Determines if the actor is loaded. Returns true if it is, false otherwise
   * @param renderRef The ref of the actor to check
   */
  public isActorLoaded(renderRef: string): boolean {
    let actorRef = "";
    if (this.$renders[renderRef]) { actorRef = this.$renders[renderRef].actorRef; }
    return this.actorController.isActorLoaded(actorRef);
  }

  /**
   * Determines if the sheet is loaded. Returns true if it is, false otherwise
   * @param ref The ref of the sheet to check
   */
  public isSheetLoaded(ref: string): boolean {
    return false;
  }

  /**
   * Determines if the ruleset is loaded. Returns true if it is, false otherwise
   * @param ref The ref of the ruleset to check
   */
  public isRulesetLoaded(ref: string): boolean {
    return false;
  }

  /**
   * Renders the variables of an element into useable strings
   * @param id The ID of the render to render variables for
   * @param element The element descriptor containing the actor sheet fields to render
   * @param fields The specific fields in the element descriptor to render variables for
   * @returns A subset of the given element with the specified fields
   */
  public renderVariables<T extends GenericSheetElementDescriptor>(
    id: string,
    element: T,
    fields: string[]
  ): Record<string, string> {
    const parsedVariables: Record<string, string> = {};

    for (const field of fields) {
      if (!(field in element)) { continue; }
      const value = element[field as (keyof T)];
      parsedVariables[field] = ActorController.renderVariable(id, value);
    }

    return parsedVariables;
  }

  /**
   * Renders out a single variable
   * @param id The ID of the render
   * @param value The object containing the information required to render
   * @returns A single string containing the rendered value
   */
  public renderVariable(id: string, value: unknown): string {
    if (typeof value === "string") return value;
    else if (!Array.isArray(value)) { return value as string; } // Should never happen

    let output = '';
    for (const chunk of value) {
      if (Array.isArray(chunk)) { output += this.convertVariableToData(id, chunk); }
      else { output += chunk; }
    }
    return output;
  }

  /**
   * Converts a variable tuple
   * @param id The ID of the render
   * @param chunk The variable tuple to decode
   * @returns The value of the decoded variable
   */
  public convertVariableToData(id: string, chunk: SheetVariableTuple) {
    const { rulesetRef, sheetRef } = this.$renders[id];
    switch (chunk[0]) {
      case "character":
        const characterValue = this.getActorField(id, chunk[1]);
        return characterValue;
      case "rules":
        const ruleValue = this.rulesetController.getRulesetVariable(rulesetRef, RuleVariableGroup.STATIC, chunk[1]);
        return ruleValue;
      case "sheet":
        const sheetValue = this.sheetController.getVariable(sheetRef, chunk[1]);
        return sheetValue;
    }

  }
}

export const ActorController = new $ActorController();
