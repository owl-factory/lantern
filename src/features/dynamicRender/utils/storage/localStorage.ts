import { GetOptions, SetOptions, StorageController } from "features/dynamicRender/types/storage";
import { TargetType } from "features/dynamicRender/types/targetType";
import { Character } from "types/character";
import { getLocalStorage, setLocalStorage } from "utils/localStorage";
import { ValidationController } from "../validation";

/**
 * A StorageController that interfaces with the browser's LocalStorage
 */
export class LocalStorageController extends ValidationController implements StorageController {
  characterId: string;
  targetType: TargetType;
  errors: string[];

  character?: Character;

  constructor(characterId: string, targetType: TargetType) {
    super();
    this.characterId = characterId;
    this.targetType = targetType;

    this.character = getLocalStorage(this.characterId, "object");
  }

  /**
   * Validates the current controller against any errors
   */
  validate() {
    if (this.targetType !== TargetType.Character) {
      this.errors.push("Local Storage is only configured to use Characters");
    }
  }

  /**
   * Gets a single piece of data from the given options
   * @param options - The options describing what data to get
   * @returns A value if found, or undefined if not
   */
  get<T>(options: GetOptions | string): T | undefined {
    if (typeof options === "string") return undefined;
    switch (options.source) {
      case "character":
        return this.character?.data[options.key] as T | undefined;
      case "content":
        return undefined;
      // const contents = this.character?.content[options.key] ?? undefined;
      // if (contents === undefined) return undefined;
    }
  }

  /**
   * Sets a single piece of data from the given options
   * @param options - The options describing what data to update
   * @returns True if the update was successful; false otherwise
   */
  update<T>(options: SetOptions<T>): boolean {
    if (options.source !== "character") return false;
    if (!this.character) return false;
    this.character.data[options.key] = options.value;
    this.triggerUpdate();
  }

  /**
   * Triggers an update to save the data in its permanent storage location
   */
  triggerUpdate() {
    if (!this.character) return;
    setLocalStorage(this.characterId, this.character);
  }
}
