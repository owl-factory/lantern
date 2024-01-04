"use client";

import { CharacterList } from "./characterList";
import { useEffect, useState } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "utils/localStorage";
import { CharacterView } from "./characterView";
import { Character } from "types/character";

const LOCAL_CHARACTERS_KEY = "characters";

export type StoredCharacter = {
  name: string;
  key: string;
};

function createLocalStorageCharacterId(key: string): string {
  return `character-${key}`;
}

const DEFAULT_CHARACTER_DATA: Character = {
  id: "no-id",
  name: "No Name",
  data: { name: "No Name" },
  content: {},
};

/**
 * Renders a page for creating and editing characters in LocalStorage
 */
function CharactersPage() {
  const { data: characterIds, update } = useLocalStorage<string[]>(LOCAL_CHARACTERS_KEY, []);
  const [currentCharacterId, setCurrentCharacterId] = useState<string | undefined>(undefined);

  // Removes any characterIDs that don't have associated characters
  useEffect(() => {
    characterIds
      .filter((characterId: string) => getLocalStorage(characterId, "string").ok === false)
      .forEach(deleteCharacter);
  }, [characterIds]);

  /**
   * For a given key, finds the character from the list of characters and sets that as the current character.
   * @param key - The key of the character to select
   */
  function onCharacterClick(key: string) {
    const characterId: string | undefined = characterIds.find((characterId: string) => characterId === key);
    setCurrentCharacterId(() => characterId);
  }

  /**
   * Adds a new Local Storage character
   */
  function addCharacter() {
    const rawCharacterId = crypto.randomUUID();
    const characterId = createLocalStorageCharacterId(rawCharacterId);

    const updatedCharacters = [...characterIds, characterId];

    const character: Character = { ...DEFAULT_CHARACTER_DATA, id: characterId };
    const setSuccess = setLocalStorage(characterId, character);
    if (!setSuccess) {
      // TODO - make this logging a user-visible feature
      console.error("A new character could not be created.");
      return;
    }

    update(updatedCharacters);
    setCurrentCharacterId(characterId);
  }

  /**
   * Deletes a character from Local Storage
   * @param key - The key of the character to delete
   */
  function deleteCharacter(key: string) {
    const updatedCharacters = characterIds.filter((currentKey: string) => key !== currentKey);
    removeLocalStorage(key);
    update(updatedCharacters);
    if (currentCharacterId !== key) return;
    setCurrentCharacterId(undefined);
  }

  return (
    <>
      <h1>Characters</h1>
      <div>
        <div>
          <CharacterList
            characterIds={characterIds}
            addCharacter={addCharacter}
            deleteCharacter={deleteCharacter}
            onCharacterClick={onCharacterClick}
          />
        </div>
        <div>
          <CharacterView characterId={currentCharacterId} />
        </div>
      </div>
    </>
  );
}

export default CharactersPage;
