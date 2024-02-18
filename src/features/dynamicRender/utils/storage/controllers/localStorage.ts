import { Character } from "types/character";
import { getLocalStorage, setLocalStorage } from "utils/localStorage";
import { action, computed, observable, safeMakeObservable } from "lib/mobx";
import { GetOptions, QuerySource } from "features/dynamicRender/types/query";
import { StorageControllerState } from "features/dynamicRender/types/controllers/storage";
import { StorageController } from "./common";

const NULL_CHARACTER = { data: {}, content: {} } as Character;

/**
 * A StorageController that interfaces with the browser's LocalStorage
 */
export class LocalStorageController extends StorageController {
  _characterId: string;
  _character: Character = NULL_CHARACTER;

  constructor(characterId: string) {
    super();
    this._characterId = characterId;

    const mobxResult = safeMakeObservable(this, {
      _character: observable,
      ready: computed,
      setState: action,
      update: action,
    });

    if (mobxResult.ok === false) {
      this.setState(StorageControllerState.MobxError, mobxResult.error);
      return this;
    }

    this.setState(StorageControllerState.Initialized);
  }

  /**
   * Loads the character in from the local storage
   */
  async load() {
    const initialized = this._state === StorageControllerState.Initialized;
    if (!initialized) return;

    this.setState(StorageControllerState.Loading);

    const characterResult = getLocalStorage(this._characterId, "object");
    if (characterResult.ok === false) {
      this.setState(
        StorageControllerState.LocalStorageMissing,
        `The character with id ${this._characterId} could not be found in Local Storage`
      );
      return;
    }
    this._character = characterResult.data as Character;
    this.setState(StorageControllerState.Ready);
  }

  /**
   * Gets a single piece of data from the given options
   * @param options - The options describing what data to get
   * @returns A value if found, or undefined if not
   */
  get<T>(options: GetOptions | string): T | undefined {
    if (typeof options === "string") return undefined;
    switch (options.source) {
      case QuerySource.Self:
        return this._character?.data[options.key] as T | undefined;
      // case QuerySource.Content:
      //   return undefined;
      // const contents = this.character?.content[options.key] ?? undefined;
      // if (contents === undefined) return undefined;
    }
  }

  /**
   * Sets a single piece of data from the given options
   * @param options - The options describing what data to update
   * @returns True if the update was successful; false otherwise
   */
  update<T>(options: GetOptions, value: T): boolean {
    if (options.source !== QuerySource.Self) return false;
    if (!this._character) return false;
    this._character.data[options.key] = value;
    this.triggerUpdate();
    return true;
  }

  /**
   * Triggers an update to save the data in its permanent storage location
   */
  triggerUpdate() {
    if (!this._character) return;
    setLocalStorage(this._characterId, this._character);
  }
}
