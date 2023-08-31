import { DocumentNode, gql } from "@apollo/client";
import { action, makeObservable, observable } from "mobx";
import { apolloClient } from "src/graphql/apollo-client";
import { Scalar } from "types";

type FieldPath = string | (string | number)[];
type GenericDataType = Record<string, unknown> | Scalar;

export class ActiveData<StoredData extends Record<string, unknown>, RawData extends Record<string, unknown>> {
  public readonly id: string;
  public data?: StoredData;
  public changes: Partial<StoredData> = {};

  protected fetchQuery: DocumentNode = gql``;
  protected updateQuery: DocumentNode = gql``;

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
   */
  public async refresh() {
    const data = await apolloClient.query({
      query: this.fetchQuery,
      variables: {
        id: this.id,
      },
    });
    this.onRefresh(data);
    return;
  }

  /**
   * A function to run after the refresh action has run successfully
   * @override
   */
  public onRefresh(data: Record<string, unknown>) {
    // OVERRIDE
  }

  /**
   * Flushes all changes to the database
   */
  public async flush() {
    const data = await apolloClient.mutate({
      mutation: this.updateQuery,
      variables: {
        id: this.id,
      },
    });
    this.onRefresh(data.data);
  }

  public async onFlush(data: Record<string, unknown>) {
    // OVERRIDE
  }

  public transformFromRaw(rawData: RawData): StoredData {
    return rawData as unknown as StoredData;
  }

  public transformToRaw(storedData: StoredData): RawData {
    return storedData as unknown as RawData;
  }
}
