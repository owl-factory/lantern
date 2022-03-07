/**
 * The Grouping functionality is for grouping data meeting specific criteria together immediately on group generation
 * and data setting.
 */

import { DataManager, isValidRef } from "../DataManager";

type GenericRecord = Record<string, unknown>;

/**
 * Adds a grouping of data to limit the amount of data being filtered.
 * For example, the campaigns that a user plays in, or content that a user owns.
 * @public
 * @param name The name of the group
 * @param validation The function to validate if a document is in a group or not
 */
export function addGroup<T extends GenericRecord>(
  this: DataManager<T>,
  name: string,
  validation: (doc: T | undefined) => boolean
): void {
  // Skip adding this again if it already exists
  if (Array.isArray(this.$groups[name]) && this.$groupValidation[name]) { return; }

  this.$groups[name] = [];
  this.$groupValidation[name] = validation;

  const keys = Object.keys(this.$data);
  for (const key of keys) {
    const doc = this.$data[key].doc;
    if (validation(doc)) { this.$groups[name].push(key); }
  }
}

/**
 * Removes a single group from the data manager
 * @public
 * @param name The name of the group to remove
 */
export function removeGroup<T extends GenericRecord>(this: DataManager<T>, name: string): void {
  delete this.$groups[name];
  delete this.$groupValidation[name];
}

/**
 * Clears out all of the groups, but does not delete the group itself
 * @protected
 */
export function clearGroups<T extends GenericRecord>(this: DataManager<T>) {
  const keys = Object.keys(this.$groups);
  for (const key of keys) {
    this.$groups[key] = [];
  }
}

/**
 * Handles the case where a new item is added to the data manager by checking and inserting the document
 * ref into the appropriate groups.
 * @protected
 * @param doc The document to add to the groups
 */
export function createItemInGroups<T extends GenericRecord>(this: DataManager<T>, doc: T) {
  const groupNames = Object.keys(this.$groups);
  const ref = doc.ref as string;

  if (!isValidRef(ref)) { return; }

  for (const name of groupNames) {
    const group = this.$groups[name];
    const validator = this.$groupValidation[name];

    if (group === undefined || validator === undefined) {
      console.error(`Data is missing from the '${name}' group. Cleaning up.`);
      this.removeGroup(name);
      continue;
    }

    if (validator(doc)) {
      // TODO - maybe remove this?
      if (group.indexOf(ref) !== -1) { continue; }
      group.push(ref);
    }
  }
}

/**
 * Handles an event where a document is being removed from the data manager. Removes the document from all
 * groups it is a part of
 * @param doc The document being removed
 */
export function removeItemFromGroups<T extends GenericRecord>(this: DataManager<T>, doc: T) {
  const groupNames = Object.keys(this.$groups);
  const ref = doc.ref as string;

  if (!isValidRef(ref)) { return; }

  for (const name of groupNames) {
    const group = this.$groups[name];
    const validator = this.$groupValidation[name];

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

/**
 * Handles an event where an item is updated and it's placement in the groups may change.
 */
export function updateItemInGroups<T extends GenericRecord>(this: DataManager<T>, newDoc: T, oldDoc: T) {
  const groupNames = Object.keys(this.$groups);
  const oldRef = oldDoc.ref as string;
  const newRef = newDoc.ref as string;

  if (oldRef !== newRef) { return; }

  for (const name of groupNames) {
    const group = this.$groups[name];
    const validator = this.$groupValidation[name];

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
      if (group.indexOf(newRef) !== -1) { continue; }
      group.push(newRef);
      continue;
    }

    const oldIndex = group.indexOf(newRef);
    if (oldIndex === -1) { continue; }
    group.splice(oldIndex, 1);
  }
}
