import { Packet } from "@owl-factory/cache/types";
import { Ref64 } from "@owl-factory/types";
import { DataManager } from "./DataManager";

export class GroupingController<T extends Record<string, unknown>> {

  public groups: Record<string, Ref64[]> = {};
  public validators: Record<string, (doc: T) => boolean> = {};

  /**
   * Gets the refs for documents belonging to the given group
   * @param name The name of the group to get
   * @returns A list of refs of documents belonging to the group
   */
  public getGroup(name: string): Ref64[] {
    const group = this.groups[name];
    if (group === undefined) { return []; }
    return group;
  }

  /**
   * Adds a grouping for collecting documents togeht
   * @param name The name of group
   * @param validation The validation function. Should take a document and return a boolean
   */
  public addGroup(
    name: string,
    validation: (doc: T) => boolean,
    data: Record<string, Packet<T>>
  ): void {
    // Skip if this already exists
    if (Array.isArray(this.groups[name]) && this.validators[name]) { return; }

    this.groups[name] = [];
    this.validators[name] = validation;

    // Get all data
    const refs = Object.keys(data);

    for (const ref of refs) {
      const doc = data[ref].doc;
      if (validation(doc)) { this.groups[name].push(ref); }
    }
  }

  /**
   * Removes a group and its validator
   * @param name The name of the group to remove
   */
  public removeGroup(name: string): number {
    const group = this.groups[name];
    delete this.groups[name];
    delete this.validators[name];

    if (group !== undefined) { return 1; }
    return 0;
  }

  /**
   * Clears out search grouping
   */
  public clear() {
    this.groups = {};
    this.validators = {};
  }

  /**
   * Handles changes on a new doc's addition for each existing group
   * @param doc The newly added document
   */
  public onNewDoc(doc: T) {
    const groupNames = Object.keys(this.groups);
    const ref = doc.ref as string;

    for (const name of groupNames) {
      const group = this.groups[name];
      const validator = this.validators[name];

      if (group === undefined || validator === undefined) {
        console.error(`Data is missing from the '${name}' grouping. Cleaning up.`);
        this.removeGroup(name);
        continue;
      }

      if (validator(doc)) {
        group.push(ref);
      }
    }
  }

  /**
   * Handles changes on a doc's update for each existing group
   * @param newDoc The new version of the document
   * @param oldDoc Old version of the document
   */
  public onUpdatedDoc(newDoc: T, oldDoc: T): void {
    const groupNames = Object.keys(this.groups);
    const ref = newDoc.ref as string;

    if (ref !== oldDoc.ref) { return; }

    for (const name of groupNames) {
      const group = this.groups[name];
      const validator = this.validators[name];

      if (group === undefined || validator === undefined) {
        console.error(`Data is missing from the '${name}' group. Cleaning up.`);
        this.removeGroup(name);
        continue;
      }

      const oldState = validator(oldDoc);
      const newState = validator(newDoc);

      if (oldState === newState) { continue; }
      else if (newState) {
        // TODO - ensure that we can remove this and then do
        if (group.indexOf(ref) !== -1) { continue; }
        group.push(ref);
        continue;
      }

      const oldIndex = group.indexOf(ref);
      if (oldIndex === -1) { continue; }
      group.splice(oldIndex, 1);
    }
  }

  /**
   * Handles a document being removed
   * @param doc The document being removed
   */
  public onRemoveDoc(doc: T) {
    const groupNames = Object.keys(this.groups);
    const ref = doc.ref as string;

    for (const name of groupNames) {
      const group = this.groups[name];
      const validator = this.validators[name];

      if (group === undefined || validator === undefined) {
        console.error(`Data is missing from the '${name}' group. Cleaning up.`);
        this.removeGroup(name);
        continue;
      }

      if (!validator(doc)) { continue; }

      const index = group.indexOf(ref);
      if (index === -1) { continue; }
      group.splice(index, 1);
    }

  }
}
