"use client";

import { Character } from "types/character";
import { CharacterList } from "./characterList";
import { useState } from "react";
import { useLocalStorage } from "hooks/useLocalStorage";
import { uuid } from "lib/uuid";
import { setLocalStorage } from "utils/localStorage";
import { CharacterView } from "./characterView";

const LOCAL_CHARACTERS_KEY = "characters";

type StoredCharacter = {
  name: string;
  key: string;
};

type StoredCharacterData = {
  data: Record<string, unknown>;
  content: Record<string, unknown>;
};

function createLocalStorageCharacterId(key: string): string {
  return `character-${key}`;
}

const DEFAULT_CHARACTER_DATA: StoredCharacterData = {
  data: {},
  content: {},
};

/**
 * Renders a page for creating and editing characters in LocalStorage
 */
function CharactersPage() {
  const { data: characters, update } = useLocalStorage<StoredCharacter[]>(LOCAL_CHARACTERS_KEY, []);
  const [currentCharacter, setCurrentCharacter] = useState<Character | undefined>(undefined);

  /**
   * For a given key, finds the character from the list of characters and sets that as the current character.
   * @param key - The key of the character to select
   */
  function onCharacterClick(key: string) {
    const character: Character | undefined = characters.find((character: Character) => character.key === key);
    setCurrentCharacter(() => character);
  }

  /**
   * Adds a new Local Storage character
   */
  function addCharacter() {
    const newCharacter: StoredCharacter = { name: "No Name", key: uuid() };
    const updatedCharacters = [...characters, newCharacter];

    const characterId = createLocalStorageCharacterId(newCharacter.key);
    const setSuccess = setLocalStorage(characterId, { ...DEFAULT_CHARACTER_DATA });
    if (!setSuccess) {
      // TODO - make this logging a user-visible feature
      console.error("A new character could not be created.");
      return;
    }

    update(updatedCharacters);
    setCurrentCharacter(newCharacter);
  }

  return (
    <>
      <h1>Characters</h1>
      <div>
        <div>
          <CharacterList characters={characters} addCharacter={addCharacter} onCharacterClick={onCharacterClick} />
        </div>
        <div>
          <CharacterView character={currentCharacter} />
        </div>
      </div>
    </>
  );
}

export default CharactersPage;
