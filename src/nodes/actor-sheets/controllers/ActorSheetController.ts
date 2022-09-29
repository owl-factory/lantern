import { action, makeObservable, observable, toJS } from "mobx";
import { RulesetDocument } from "types/documents";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { SheetController } from "./subcontrollers/SheetController";
import { read } from "@owl-factory/utilities/objects";
import { RenderGroup, SheetProperties } from "../types";
import { ActorContent, ActorDocument } from "types/documents/Actor";
import { ParsedExpression } from "../../../types/expressions";
import { Scalar } from "types";
import { parseContentFieldArguments } from "../utilities/field";
import { StateType } from "../enums/stateTypes";
import { DataController } from "./subcontrollers/DataController";
import { DataSource } from "../enums/dataSource";
import { extractVariables } from "../utilities/parse";
import { parseXML } from "../utilities/parser";
import { StateController } from "./subcontrollers/StateController";
import { Mediator } from "nodes/mediator";
import { MediatorPost, MediatorRequest } from "nodes/mediator/types/mediator";
import { Actor, ActorSheet, Ruleset } from "@prisma/client";


/**
 * Handles rendering all actor sheets and populating them with data
 */
class $ActorController {
  public $renders: Record<string, RenderGroup> = {};
  public $variables: Record<string, Scalar | Scalar[]> = {};

  protected dataController = new DataController();
  protected sheetController = new SheetController();
  protected stateController = new StateController();

  constructor() {
    makeObservable(this, {
      $renders: observable,

      newRender: action,
      endRender: action,
    });
  }

  /**
   * Initializes a render by grouping together three different values so that accessing each value requires
   * only one unique value instead of three
   * @param actorID The reference to the actor used in this render. If null, a temporary actor will be used instead
   * @param rulesetID The reference to the ruleset used in this render. If null, empty values will be used instead
   * @param sheetID The reference to the sheet used in this render
   */
   public newRender(actorID: string | null, rulesetID: string | null, sheetID: string, renderID?: string): string {
    const id = renderID || actorID || sheetID;
    this.$renders[id] = { actorID: actorID || "temp-actor", sheetID, rulesetID: rulesetID || "temp-ruleset" };

    return id;
  }

  /**
   * Removes a render
   * @param renderID The ID of the render to remove
   */
  public endRender(renderID: string) {
    // TODO - add counting for render items for garbage collection
    delete this.$renders[renderID];
  }

  /** LOAD **/

  /**
   * Loads in an actor to the actor sheet controller
   * @param actorID The ID of the actor being loaded in
   * @param actor The actor's data being loaded in
   */
  public loadActor(actorID: string, actor: Actor) {
   this.load(DataSource.Actor, actorID, actor.fields);
   this.load(DataSource.Content, actorID, actor.content);
  }

  /**
   * Loads a ruleset in to the actor sheet controller
   * @param rulesetID The ID of the ruleset being loaded in
   * @param ruleset The ruleset data being loaded in
   */
  public loadRuleset(rulesetID: string, ruleset: Ruleset) {
    if (!ruleset.rules) { this.load(DataSource.Ruleset, rulesetID, {}); }
    else { this.load(DataSource.Ruleset, rulesetID, (ruleset.rules as any).values); }
  }

  /**
   * Loads a sheet into the actor sheet controller
   * @param sheetID The ID of the sheet being loaded into the sheet controller
   * @param sheet The sheet document containing data to be loaded in
   */
  public loadSheet(sheetID: string, sheet: Partial<ActorSheet>) {
    if (sheet.layout === undefined) { return; }
    const xml = parseXML(sheet.layout);
    const variables = extractVariables(xml);

    this.load(DataSource.Sheet, sheetID, variables);
    this.sheetController.load(sheetID, sheet.layout, sheet.styling as string);
  }

  /**
   * A generic function for loading in all of the data for a type of data and its ID
   * @param source The source that this data originates from
   * @param id The string identifying what is being loaded in
   * @param value The value being loaded in
   */
  protected load(source: DataSource, id: string, value: unknown) {
    try {
      this.dataController.load(source, id, value);
      Mediator.post(MediatorPost.SetSandbox, {source, id, value});
    } catch (e) {
      console.error(e);
    }
  }

  /** LOAD END **/

  /** UNLOAD **/

  /**
   * Unloads a single actor
   * @param actorID The ref of the actor to unload
   */
   public unloadActor(actorID: string) {
    this.unload(DataSource.Actor, actorID);
    this.unload(DataSource.Content, actorID);
  }

  /**
   * Unloads a single ruleset
   * @param rulesetID The ID of the ruleset to unload
   */
   public unloadRuleset(rulesetID: string) {
    this.unload(DataSource.Ruleset, rulesetID);
  }

  /**
   * Unloads a single sheet
   * @param sheetID The ID of the sheet to unload
   */
  public unloadSheet(sheetID: string) {
    this.unload(DataSource.Sheet, sheetID);
  }

  /**
   * Unloads a full piece of data
   * @param source The type of data being unloaded
   * @param id The ID of the data being unloaded
   */
  protected unload(source: DataSource, id: string) {
    try {
      this.dataController.unload(source, id);
    } catch (e) {
      console.error(e);
    }
  }

  /** UNLOAD END **/

  /** GET DATA **/

  /**
   * Gets an actor by their render ref and the field
   * @param renderID The ref of the render to check for the actor's true ref
   */
  public getActor(renderID: string, field: string, properties: SheetProperties): Scalar {
    if (!field) { return ""; }
    // Actors do not and should not have any periods
    if (field.search(/\./) === -1) {
      return (this.get(DataSource.Actor, renderID, field) || "") as Scalar;
    }

    const { contentType, index, name } = parseContentFieldArguments(field, properties);

    // Catches all failure cases where some piece of data is missing
    if (contentType === "" || index === undefined || index < 0 || name === "") { return ""; }
    const content = this.get(DataSource.Content, renderID, contentType, index);
    return content[name] || "";
  }

  /**
   * Gets a value from the data controller
   * @param source The source this data is fetched from
   * @param renderID The ID of the render to draw data from
   * @param key The field key to fetch data from
   * @param index Optional. The index of the array to draw data from
   */
  protected get(source: DataSource, renderID: string, key: string, index?: number) {
    const renderIDs = this.$renders[renderID];
    try {
      return this.dataController.get(source, renderIDs, key, index);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  /** GET DATA END **/

  /** SET DATA **/

  /**
   * Sets a single value within an actor by their render ref and the field
   * @param renderID The ref of the render to check for the actor's true ref
   * @param field The field that will have data set at
   * @param properties The current properties of the actor sheet at the time of setting data
   * @param value The new value to set
   */
  public setActor(renderID: string, field: string, properties: SheetProperties, value: any) {
    // Actors do not and should not have any periods
    if (field.search(/\./) === -1) {
      this.set(DataSource.Actor, renderID, value, field);
      return;
    }

    const { contentType, index, name } = parseContentFieldArguments(field, properties);
    const content = this.get(DataSource.Content, renderID, contentType, index);
    content[name] = value;
    this.set(DataSource.Content, renderID, content, contentType, index);
  }

  /**
   * Pushes a new piece of content
   * @param renderID The ID that the content belongs to
   * @param field The field that will have content added to
   * @param properties The current properties of the actor sheet at the time of pushing content
   * @param value The new value to push to the list of content
   */
  public pushContent(renderID: string, contentType: string, value: Record<string, Scalar>) {
    this.set(DataSource.Content, renderID, value, contentType, -1);
  }

  /**
   * Removes a single item from an actor's contents
   * @param renderID The ID of the render that will be having a content item removed
   * @param contentGroup The type of content that will be having an item removed
   * @param index The index of the content item to remove
   */
   public deleteContent(renderID: string, contentType: string, index: number) {
    this.set(DataSource.Content, renderID, null, contentType, index);
  }

  /**
   * Sets data
   * @param source The source that will be set with the new data
   * @param renderID The ID of the render to set data in
   * @param value The value to set
   * @param key The field key to set data at
   * @param index Optional. The index of the array to set data at
   */
  protected set(source: DataSource, renderID: string, value: any, key: string, index?: number) {
    const renderIDs = this.$renders[renderID];
    try {
      this.dataController.set(source, renderIDs, value, key, index);
      // Sets to the web worker on a change
      const workerValue = this.dataController.get(source, renderIDs, key, index);
      // TODO - select id from source
      Mediator.post(MediatorPost.SetSandbox, {source, id: renderIDs.actorID, value: workerValue, key});
    } catch (e) {
      console.error(e);
      return;
    }
  }

  /** SET DATA END **/

  /** EXPORT **/

  /**
   * Gets an actor by their render ref
   * @param renderID The ref of the render to check for the actor's true ref
   */
  public exportActor(renderID: string): Partial<Actor> {
    const actorID = this.$renders[renderID].actorID;
    const actor: Partial<Actor> = {};
    actor.id = actorID;
    actor.fields = this.export(DataSource.Actor, renderID) as Record<string, Scalar> | undefined;
    actor.content = this.export(DataSource.Content, renderID) as Record<string, ActorContent[]> | undefined;
    return actor;
  }

  /**
   * Exports a full piece of data from the data controller
   * @param source The data source of the data being exported
   * @param renderID The ID of the render to export data from
   */
  protected export(source: DataSource, renderID: string) {
    const renderIDs = this.$renders[renderID];
    try {
      return this.dataController.export(source, renderIDs);
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  /** EXPORT END **/

  /**
   * Grabs the sheet for the given render
   * @param ref The ref of the render to fetch the sheet for
   * @returns The found sheet
   */
  public getSheet(ref: string): PageDescriptor {
    let sheetRef = "";
    if (this.$renders[ref]) { sheetRef = this.$renders[ref].sheetID; }
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
    if (this.$renders[renderID]) { sheetRef = this.$renders[renderID].sheetID; }
    return this.sheetController.getTabs(sheetRef, key);
  }

  /**
   * Renders the variables of an element into useable strings
   * @param renderID The ID of the render to render variables for
   * @param element The element descriptor containing the actor sheet fields to render
   * @param attributes The specific fields in the element descriptor to render variables for
   * @returns A subset of the given element with the specified fields
   */
  public async renderExpressions<T extends GenericSheetElementDescriptor>(
    renderID: string,
    element: T,
    attributes: string[],
    properties: SheetProperties
  ): Promise<Record<string, string>> {
    const parsedVariables: Record<string, string> = {};

    const renderIDs = this.$renders[renderID];

    for (const attributeName of attributes) {
      if (!(attributeName in element)) { continue; }

      const parsedExpression = element[attributeName as (keyof T)] as unknown as ParsedExpression;
      if (!parsedExpression.hasExpression || parsedExpression.value === "") {
        parsedVariables[attributeName] = parsedExpression.value;
        continue;
      }

      const exprVariables = this.dataController.getExprVariables(renderIDs, parsedExpression.variables || []) as any;
      properties.character = exprVariables.actor;
      properties.content = exprVariables.content;
      properties.ruleset = exprVariables.ruleset;
      properties.sheet = exprVariables.sheet;

      parsedVariables[attributeName] = (
        await Mediator.requests(MediatorRequest.SandboxExpr, {expression: parsedExpression, properties})
      ) as string;

      delete properties.character;
      delete properties.content;
      delete properties.ruleset;
      delete properties.sheet;
    }

    return parsedVariables;
  }

  /**
   * Converts a variable tuple
   * @param renderID The ID of the render
   * @param chunk The variable tuple to decode
   * @returns The value of the decoded variable
   */
  public convertVariableToData(renderID: string, variable: string, properties: SheetProperties) {
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

    switch (firstAddress) {
      // The value comes from the character sheet
      case "character":
        return this.get(DataSource.Actor, renderID, remainderAddress);
      case "content":
        return this.get(DataSource.Content, renderID, remainderAddress);
      // The value comes from plugins, campaign, or ruleset
      case "rules":
        return this.get(DataSource.Ruleset, renderID, remainderAddress);
      // A value defined by the sheet
      case "sheet":
        return this.get(DataSource.Sheet, renderID, remainderAddress);
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

