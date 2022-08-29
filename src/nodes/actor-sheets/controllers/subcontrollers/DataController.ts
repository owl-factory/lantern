import { read, set } from "@owl-factory/utilities/objects";
import { action, makeObservable, observable, toJS } from "mobx";
import { DataSource } from "nodes/actor-sheets/enums/dataSource";
import { RenderGroup } from "nodes/actor-sheets/types";
import { Scalar } from "types";
import { ActorContent } from "types/documents/Actor";

export class DataController {
  // Actor and Actor Content data
  public $actor: Record<string, Record<string, Scalar>> = {};
  public $content: Record<string, Record<string, ActorContent[]>> = {};
  // Sheet Variables
  public $sheet: Record<string, Record<string, Scalar>> = {};
  // Ruleset variables
  public $ruleset: Record<string, Record<string, unknown>> = {};

  constructor() {
    makeObservable(this, {
      $actor: observable,
      $content: observable,
      $sheet: observable,
      $ruleset: observable,
      load: action,
      set: action,
    });
  }

  /**
   * Exports out a full, single piece of data from the data controller
   * @param source The source to pull the data from
   * @param renderIDs The group of render IDs to take the relevant ID from
   */
  public export(source: DataSource, renderIDs: RenderGroup) {
    switch (source) {
      case DataSource.Actor:
        return this.$actor[renderIDs.actorID];
      case DataSource.Content:
        return this.$content[renderIDs.actorID];
      case DataSource.Ruleset:
        return this.$ruleset[renderIDs.rulesetID];
      case DataSource.Sheet:
        return this.$sheet[renderIDs.sheetID];
    }
  }

  /**
   * Gets a piece of data for a specific source and render
   * @param source The group of data to fetch the variable from
   * @param renderIDs A collection of IDs used in the same render
   * @param key The key of the variable to fetch
   * @param index The index of an array to fetch the data of, if any
   * @returns A Scalar or complex object, if any is found
   */
  public get(source: DataSource, renderIDs: RenderGroup, key?: string, index?: number) {
    switch(source) {
      case DataSource.Actor:
        return this.getActor(renderIDs.actorID, key);

      case DataSource.Content:
       return this.getContent(renderIDs.actorID, key, index);

      case DataSource.Ruleset:
        return this.getRuleset(renderIDs.rulesetID, key, index);

      case DataSource.Sheet:
        return this.getSheet(renderIDs.sheetID, key);
    }
  }

  /**
   * Sets a piece of data
   * @param source The data source that's being updated
   * @param renderIDs The collection of different ids for a single render
   * @param value The value to set
   * @param key The key of the field to set the value in
   * @param index The index of the array to set the value at
   */
   public set(source: DataSource, renderIDs: RenderGroup, value: unknown, key: string, index?: number) {
    switch(source) {
      case DataSource.Actor:
        this.setActor(renderIDs.actorID, value as Scalar, key);
        break;

      case DataSource.Content:
        if (index === undefined) { this.setContent(renderIDs.actorID, value as any, key); }
        else { this.setContentItem(renderIDs.actorID, value as any, key, index); }
        break;
    }
  }

  /**
   * Loads in a full item for a given data source and field, such as all of an actor's fields or contents
   * @param source The source of data this information is being loaded from
   * @param id The id that the data should be stored at for it's respective data source
   * @param value The value being stored
   */
  public load(source: DataSource, id: string, value: unknown) {
    switch(source) {
      case DataSource.Actor:
        if (typeof value !== "object") {
          throw `Actor Sheet Data Exception: Setting an actor must be a record containing scalar values`;
        }
        this.$actor[id] = value as Record<string, Scalar>;
        break;
      case DataSource.Content:
        this.$content[id] = value as any;
        break;
      case DataSource.Ruleset:
        this.$ruleset[id] = value as any;
        break;
      case DataSource.Sheet:
        this.$sheet[id] = value as any;
        break;
    }
  }

  /**
   * Unloads a single full collection of data
   * @param source The type of data being unloaded
   * @param id The ID of the data to be unloaded
   */
  public unload(source: DataSource, id: string) {
    switch(source) {
      case DataSource.Actor:
        delete this.$actor[id];
        break;
      case DataSource.Content:
        delete this.$content[id];
        break;
      case DataSource.Ruleset:
        delete this.$ruleset[id];
        break;
      case DataSource.Sheet:
        delete this.$sheet[id];
        break;
    }
  }

  /**
   * Gets the variables used for a specific expression, allowing it to be faster 
   * @param renderIDs The IDs of the data that is being rendered
   * @param varNames The variable names that are used in an expression rendering
   */
  public getExprVariables(renderIDs: RenderGroup, varNames: string[]) {
    const exprVariables = {};
    for (const name of varNames) {
      const leadingName = name.replace(/\..*/, "");
      const remainderName = name.replace(/^[^.]+?\./, "");

      let value;
      switch(leadingName) {
        case "character":
          value = read(this.$actor[renderIDs.actorID], remainderName);
          const actorName = `actor.${remainderName}`;
          set(exprVariables, actorName, toJS(value));
          continue;
        case "content":
          value = read(this.$content[renderIDs.actorID], remainderName);
          break;
        case "ruleset":
          value = read(this.$ruleset[renderIDs.rulesetID], remainderName);
          break;
        case "sheet":
          value = read(this.$sheet[renderIDs.sheetID], remainderName);
          break;
        default:
          continue;
      }

      set(exprVariables, name, toJS(value));
    }
    return exprVariables;
  }

  /**
   * Fetches all of an actor's fields or a single field
   * @param actorID The ID of the actor to fetch data from
   * @param key Optional. The key of the field to fetch from the actor's fields
   * @returns A scalar value of a key is provided or the full actor if none is given
   */
  private getActor(actorID: string, key?: string): Scalar | Record<string, Scalar> {
    const actor = this.$actor[actorID] || {};
    if (key === undefined) { return actor; }
    return actor[key] || "";
  }

  /**
   * Fetches all of an actor's content, all content of a single type, or a single piece of content
   * @param actorID The ID of the actor to fetch data from
   * @param key Optional. The key of the field to fetch from the actor's fields
   * @returns A scalar value of a key is provided or the full actor if none is given
   */
  private getContent(actorID: string, key?: string, index?: number): Record<string, unknown[]> | unknown[] | unknown {
    const allContent = this.$content[actorID] || {};
    if (!key) { return allContent; }

    const content = allContent[key] || [];
    if (index === undefined) { return content; }

    return content[index] || {};
  }

  /**
   * Gets a full ruleset, a value from that ruleset, or an item from an array of the ruleset value
   * @param rulesetID The ID of the ruleset to fetch data from
   * @param key Optional. The key of the data to return
   * @param index Optional. The index of data to fetch from the rule array
   * @returns The full ruleset or the content of a single ruleset value
   */
  private getRuleset(rulesetID: string, key?: string, index?: number) {
    const ruleset = this.$ruleset[rulesetID] || {};
    if (key === undefined) { return ruleset; }

    const rule = ruleset[key] as any;
    if (index === undefined || Array.isArray(rule) === false) { return rule; }
    return rule[index];
  }

  /**
   * Gets the sheet variables or a single sheet variable
   * @param sheetID The ID of the sheet to grab the variables for
   * @param key The key of the value to return
   * @returns Returns the sheet variables or a single variable
   */
  private getSheet(sheetID: string, key?: string) {
    const sheet = this.$sheet[sheetID] || {};
    if (key === undefined) { return sheet; }
    return sheet[key];
  }

  private setActor(actorID: string, value: Scalar, key: string) {
    // Sets a scalar
    if (!isScalar(value)) {
      throw `Actor Sheet Data Exception: A scalar value is required for setting an actor's field value.`;
    }
    if (this.$actor[actorID] === undefined) { this.$actor[actorID] = {}; }
    this.$actor[actorID][key] = value as Scalar;
  }

  private setContent(actorID: string, value: unknown[], key: string) {
    if (!Array.isArray(value)) {
      throw `Actor Sheet Data Exception: An array is required for setting a content list`;
    }

    // Ensures that there's a struct for storing this content data if none is present
    if (this.$content[actorID] === undefined) { this.$content[actorID] = {}; }

    this.$content[actorID][key] = value;
  }

  /**
   * Sets or adds a single content item
   * @param actorID The ID of the actor to set a content item for
   * @param key The key of the content type to set
   * @param index The index of the content item to replace. If -1 or greater than the current size,
   *  the item is pushed instead
   * @param value The value to set to the content item
   */
  private setContentItem(actorID: string, value: Record<string, Scalar> | null, key: string, index: number) {
    // TODO - validate the content item

    // Ensures that there is a struct and array to place data if this isn't loaded
    // This should never happen, but this is present for safety
    if (this.$content[actorID] === undefined) { this.$content[actorID] = {}; }
    if (this.$content[actorID][key] === undefined) this.$content[actorID][key] = [];

    // Cases for index in range
    if (index >= 0 && index < this.$content[actorID][key].length) {
      // Removes an item if the value is null
      if (value === null) {
        this.$content[actorID][key].splice(index, 1);
        return;
      }
      this.$content[actorID][key][index] = value;
      return;
    }

    if (value === null) {
      throw `Actor Sheet Data Exception: Null Content cannot be added to the to a content list`;
    }

    this.$content[actorID][key].push(value);
  }
}

function isScalar(value: unknown) {
  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}



