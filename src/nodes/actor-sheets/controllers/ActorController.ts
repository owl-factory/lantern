import { action, makeObservable, observable, toJS } from "mobx";
import { RulesetDocument } from "types/documents";
import { ActorSheetDocument } from "types/documents/ActorSheet";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { SheetController } from "./SheetController";
import { ActorSubController } from "./ActorSubController";
import { RuleVariableGroup, RulesetController } from "./RulesetController";
import { read } from "@owl-factory/utilities/objects";
import { SheetProperties } from "../types";
import { ActorContent, ActorDocument } from "types/documents/Actor";
import { ParsedExpressionString } from "../types/expressions";
import { Scalar } from "types";
import { parseContentFieldArguments } from "../utilities/field";
import { StateController } from "./StateController";
import { StateType } from "../enums/stateTypes";
import { newWebWorker } from "@owl-factory/web-worker";
import SandboxedCodeWorker from "../workers/sandboxed-code.worker";
import { SandboxWorkerMessage } from "../types/workers";
import { isClient } from "@owl-factory/utilities/client";

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
  public $variables: Record<string, Scalar | Scalar[]> = {};

  protected actorController = new ActorSubController();
  protected rulesetController = new RulesetController();
  protected sheetController = new SheetController<Partial<ActorSheetDocument>>();
  protected stateController = new StateController();
  protected worker!: Worker;

  constructor() {
    const worker = newWebWorker(SandboxedCodeWorker);
    if (isClient) {
      (worker as Worker).onmessage = (message: any) => this.setVariables(message);
      this.worker = worker as Worker;
    }
    makeObservable(this, {
      $renders: observable,
      $variables: observable,

      createRender: action,
      setVariables: action,
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
  public loadActor(ref: string, actor?: Partial<ActorDocument>, force?: boolean): void {
    // Undefined case to simplify loads from the ActorDataController
    if (!actor) { return; }
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
  public getActor(renderRef: string): Partial<ActorDocument> {
    let actorRef = "";
    if (this.$renders[renderRef]) { actorRef = this.$renders[renderRef].actorRef; }
    return this.actorController.getActor(actorRef);
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
   public getActorField(renderRef: string, field: string, properties: SheetProperties): Scalar {
    // Quits out early if the actor doesn't exist
    if (!this.$renders[renderRef] || !field) { return ""; }
    const actorRef = this.$renders[renderRef].actorRef;

    // Actors do not and should not have any periods
    if (field.search(/\./) === -1) {
      return this.actorController.getFieldValue(actorRef, field) || "";
    }

    const { contentType, index, name } = parseContentFieldArguments(field, properties);

    // Catches all failure cases where some piece of data is missing
    if (contentType === "" || index === undefined || index < 0 || name === "") { return ""; }

    return this.actorController.getContentField(actorRef, contentType, index, name) || "";
  }

  /**
   * Sets a single value within an actor by their render ref and the field
   * @param renderRef The ref of the render to check for the actor's true ref
   */
  public updateActorField(renderRef: string, field: string, properties: SheetProperties, value: any) {
    // Quits out early if the actor doesn't exist
    if (!this.$renders[renderRef]) { return; }
    const actorRef = this.$renders[renderRef].actorRef;

    // Actors do not and should not have any periods
    if (field.search(/\./) === -1) {
      this.actorController.updateFieldValue(actorRef, field, value);
      return;
    }

    const { contentType, index, name } = parseContentFieldArguments(field, properties);

    // Catches all failure cases where some piece of data is missing
    if (contentType === "" || index === undefined || index < 0 || name === "") { return; }

    this.actorController.updateContentField(actorRef, contentType, index, name, value);
  }

  /**
   * Fetches the actor content for the given render ID and content group
   * @param renderID The ID of the render to get the content for
   * @param contentGroup The group of content to retrieve
   * @returns An array of actor contents. If none is found, an empty array is returned
   */
  public getContent(renderID: string, contentGroup: string): ActorContent[] {
    if (!this.$renders[renderID]) { return []; }
    const actorRef = this.$renders[renderID].actorRef;
    const content = this.actorController.getContent(actorRef, contentGroup);
    return content;
  }

  /**
   * Pushes a new piece of content to the end of a content's list
   * @param renderID The ID of the render to push a new content item to
   * @param contentGroup The group of content that is gaining a new addition
   * @param content Optionally defined content. If none is given, default values will be provided
   */
  public pushNewContent(renderID: string, contentGroup: string, content?: ActorContent) {
    if (!this.$renders[renderID]) { return; }
    const actorRef = this.$renders[renderID].actorRef;
    this.actorController.pushNewContent(actorRef, contentGroup, content);
  }

  /**
   * Removes a single item from an actor's contents
   * @param renderID The ID of the render that will be having a content item removed
   * @param contentGroup The type of content that will be having an item removed
   * @param index The index of the content item to remove
   */
  public deleteContentItem(renderID: string, contentGroup: string, index: number) {
    if (!this.$renders[renderID]) { return; }
    const actorRef = this.$renders[renderID].actorRef;
    this.actorController.deleteContentItem(actorRef, contentGroup, index);
  }

  /**
   * Grabs the sheet for the given render
   * @param ref The ref of the render to fetch the sheet for
   * @returns The found sheet
   */
  public getSheet(ref: string): PageDescriptor {
    let sheetRef = "";
    if (this.$renders[ref]) { sheetRef = this.$renders[ref].sheetRef; }
    return this.sheetController.getSheet(sheetRef);
  }

  /**
   * Fetches the state from the state controller
   * @param renderID The render ID the state is used for
   * @param stateType The type of state being fetched
   * @param key The key of the state to fetch
   * @returns The found state value. Undefined if none is found
   */
  public getState(renderID: string, stateType: StateType, key: string): Scalar | undefined {
    return this.stateController.getState(renderID, stateType, key);
  }

  /**
   * Sets a value within the state
   * @param renderID The render ID the state is used for
   * @param stateType The type of state being set
   * @param key The key of the state to set
   * @param value The new value to set in the state
   */
  public setState(renderID: string, stateType: StateType, key: string, value: Scalar){
    this.stateController.setState(renderID, stateType, key, value);
  }

  /**
   * Fetches the tabs for a particular render and Pageable element
   * @param renderID The ID of the render to fetch the tabs for
   * @param key The ID of the pageable element to fetch the tabs for
   * @returns An array of tab objects
   */
  public getTabs(renderID: string, key: string) {
    let sheetRef = "";
    if (this.$renders[renderID]) { sheetRef = this.$renders[renderID].sheetRef; }
    return this.sheetController.getTabs(sheetRef, key);
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
    elementKey: string,
    element: T,
    fields: string[],
    properties: SheetProperties
  ): Record<string, string> {
    const parsedVariables: Record<string, string> = {};

    for (const field of fields) {
      if (!(field in element)) { continue; }

      const elementField: ParsedExpressionString = element[field as (keyof T)] as unknown as ParsedExpressionString;
      parsedVariables[field] = ActorController.renderVariable(id, elementKey, element, field, elementField, properties);
    }

    return parsedVariables;
  }

  /**
   * Renders out a single variable
   * @param renderID The ID of the render
   * @param expr An array containing an expression or string(s) to render out
   * @returns A single string containing the rendered value
   */
  public renderVariable<T extends GenericSheetElementDescriptor>(
    renderID: string,
    elementKey: string,
    element: T,
    fieldName: string,
    expr: ParsedExpressionString,
    properties: SheetProperties
  ): string {
    if (!expr.isExpression) { return expr.value; }
    const key = `${elementKey}__${fieldName}`;
    // console.log(key)
    const { actorRef, sheetRef, rulesetRef } = this.$renders[renderID];
    const message: SandboxWorkerMessage = {
      ...properties,
      actor: toJS(this.actorController.getActorValues(actorRef)),
      character: toJS(this.actorController.getActorValues(actorRef)),
      content: toJS(this.actorController.getAllContent(actorRef)),
      rules: toJS(this.rulesetController.getRuleset(rulesetRef).staticVariables),
      sheet: toJS(this.sheetController.getAllVariables(sheetRef)),
      expr: expr.value,
      _key: key,
    };

    this.worker.postMessage(message);
    const value = this.$variables[key];

    return value as any;
  }

  /**
   * A callback function run when recieving a response from the web worker
   * @param msg The message recieved from the web worker to set the variables locally
   */
  public setVariables(msg: any) {
    const value = this.$variables[msg.data.key];
    if (value === msg.data.value) { return; }
    this.$variables[msg.data.key] = msg.data.value;
  }

  /**
   * Converts a variable tuple
   * @param id The ID of the render
   * @param chunk The variable tuple to decode
   * @returns The value of the decoded variable
   */
  public convertVariableToData(id: string, variable: string, properties: SheetProperties) {
    if (!variable) { return ""; }

    const firstPeriodIndex = variable.search(/\./);

    // Grabs the first portion of the variable for determining where to look for the value
    let firstAddress, remainderAddress;
    if (firstPeriodIndex > 0) {
      firstAddress = variable.substring(0, firstPeriodIndex);
      remainderAddress = variable.substring(firstPeriodIndex + 1);
    } else {
      firstAddress = variable;
      remainderAddress = variable;
    }

    const { actorRef, rulesetRef, sheetRef } = this.$renders[id];
    switch (firstAddress) {
      // The value comes from the character sheet
      case "character":
        const characterValue = this.getActorField(id, remainderAddress, properties);
        return characterValue;
      case "content":
        const contentValue = this.actorController.getContent(actorRef, remainderAddress);
        return contentValue;
      // The value comes from plugins, campaign, or ruleset
      case "rules":
        const ruleValue = this.rulesetController.getRulesetVariable(
          rulesetRef, RuleVariableGroup.STATIC, remainderAddress
        );
        return ruleValue;
      // A value defined by the sheet
      case "sheet":
        const sheetValue = this.sheetController.getVariable(sheetRef, remainderAddress);
        return sheetValue;
      // A custom value in the properties defined by a loop
      default:
        // Base case to prevent deep reads if they're unnecessary
        if (!(firstAddress in properties)) { return ""; }
        const propertiesValue = read(properties, variable);
        return propertiesValue;
    }

  }
}

export const ActorController = new $ActorController();
