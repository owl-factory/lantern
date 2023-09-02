import { DataAPI, DataEngineAPI } from ".";

/**
 * The Data Engine handles the creation, storage, and garbage collection of Active Data 
 */
export class DataEngine<T extends DataAPI> implements DataEngineAPI {

  public readonly loadedData: Record<string, T> = {};
  public readonly references: Record<string, string[]> = {};

  /**
   * Loads in an object from a given ID and returns it
   * @param id The ID of the object to load
   * @param referrer The referring object, used to track who's trying to reference that
   */
  public load(id: string, referrer: string): T {
    // This is already loaded
    if (this.loadedData[id] !== undefined) {
      this.addReference(id, referrer);
      return this.loadedData[id];
    }

    this.loadedData[id] = this.generateData(id);
    this.addReference(id, referrer);
    return this.loadedData[id];
  }

  /**
   * Frees a reference from the data. If the data has no references, it is cleaned up
   * @param id The ID of the data to free a reference of
   * @param referrer The unique ID of the entity that is no longer referring to this data
   * @returns True on success; false otherwise
   */
  public free(id: string, referrer: string): boolean {
    // If the references were not set up correctly, this would allow for clean up of data
    if (this.references[id] === undefined) {
      delete this.loadedData[id];
      return true;
    }

    const referenceIndex = this.references[id].indexOf(referrer);

    // This referrer is not currently referring this data
    if (referenceIndex === -1) return false;

    this.references[id].splice(referenceIndex, 1);
    if (this.references[id].length === 0) {
      delete this.loadedData[id];
    }
    return true;
  }

  /**
   * Adds a reference to to the data of the given object
   * @param id The ID of the data being referenced
   * @param referrer The identifier of the referrer, used to track who will be accessing this data
   */
  protected addReference(id: string, referrer: string) {
    if (this.references[id] === undefined) this.references[id] = [];
    if (this.references[id].includes(referrer)) return;
    this.references[id].push(referrer);
  }

  /**
   * Generates the data class for the specific type of DataEngine this is
   * @param id The ID of the data class to fetch and generate
   */
  protected generateData(id: string): T {
    throw "Generate Data is not implemented";
  }
}
