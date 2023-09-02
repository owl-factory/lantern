import { action, makeObservable, observable } from "mobx";
import { Scalar } from "types";
import { DataAPI } from ".";

type FieldPath = string | (string | number)[];
type GenericDataType = Record<string, unknown> | Scalar;

export class DataInstance<
  StoredData extends Record<string, unknown>,
  RawData extends Record<string, unknown>
> implements DataAPI {

  public readonly id: string;
  public data?: StoredData;
  public changes: Partial<StoredData> = {};

  constructor(id: string) {
    this.id = id;
    makeObservable(this, {
      data: observable,

      set: action,
    });
  }

  /**
   * Gets the data from a specific path
   * @param path The path to fetch data from
   * @returns Some value of the data
   */
  public get(path: FieldPath): unknown | undefined {
    if (this.data === undefined) return undefined;
    if (!Array.isArray(path)) path = [path];

    let current: GenericDataType = this.data;
    try {
      // TODO - forloop should be moved into a generic helper function
      for (let index = 0; index < path.length; index++) {
        if (current === undefined || current === null) { return undefined; }

        // If a scalar type, we can't dive deeper so return undefined
        if (typeof current !== "object") { return undefined; }

        current = (current as Record<string | number, unknown>)[path[index]] as GenericDataType;
      }
    } catch (_) {
      // Handles any errors if something bad happens
      return undefined;
    }

    return current;
  }

  /**
   * Sets data to a given field
   * @param path The path to set data at
   * @param data The data to set
   * @returns True if setting the data was successful
   */
  public set(path: FieldPath, data: Scalar): boolean {
    if (this.data === undefined) return false;
    if (!Array.isArray(path)) path = [path];

    let current: GenericDataType = this.data;
    try {
      for (let index = 0; index < path.length; index++) {
        if (index === (path.length - 1)) {
          (current as Record<string | number, unknown>)[path[index]] = data;
          break;
        }

        if (current === undefined || current === null) { return false; }

        if (typeof current !== "object") { return false; }
        current = (current as Record<string | number, unknown>)[path[index]] as GenericDataType;
      }
    } catch (_) {
      return false;
    }
    return false;
  }

  /**
   * Refreshes data from the database
   * @override
   */
  public async refresh() {
    throw "Not implemented";
  }

  /**
   * Flushes all changes to the database
   * @override
   */
  public async flush() {
    throw "Not implemented";
  }

  /**
   * Transforms data from it's raw, retrieved form into the stored data format
   * @param rawData The raw data to transform
   * @returns A stored data type
   */
  public transformFromRaw(rawData: RawData): StoredData {
    return rawData as unknown as StoredData;
  }

  /**
   * Transforms stored data into the raw format so that it can be saved
   * @param storedData The stored data to convert into a raw data format
   * @returns An object in raw data format
   */
  public transformToRaw(): RawData {
    return this.data as unknown as RawData;
  }
}
