"use client";

import { Button } from "components/ui/Button";
import { Character } from "types/character";
import { OkResult, Result } from "types/functional";
import { getLocalStorage } from "utils/localStorage";

type CharacterListProps = {
  characterIds: string[];
  addCharacter: () => void;
  deleteCharacter: (key: string) => void;
  onCharacterClick: (key: string) => void;
};

/**
 * Renders a list of characters
 * @param characters - The list of characters to render
 * @param addCharacter - A function to add a new character
 * @param onCharacterClick - A function that runs when a character is clicked
 */
export function CharacterList(props: CharacterListProps) {
  const characterElements = props.characterIds
    .map((characterId: string) => getLocalStorage(characterId, "object"))
    .filter((characterResult: Result<Character, string>) => characterResult.ok)
    .map((characterResult: OkResult<Character>) => characterResult.data)
    .map((character: Character) => (
      <li key={character.id}>
        <span onClick={() => props.onCharacterClick(character.id)}>{character.data.name} </span>
        <Button
          onClick={() =>
            confirm(`Are you sure you want to delete ${character.data.name}?`) && props.deleteCharacter(character.id)
          }
        >
          Delete
        </Button>
      </li>
    ));

  return (
    <ul>
      <li onClick={props.addCharacter}>+ Add Character</li>
      {characterElements}
    </ul>
  );
}
