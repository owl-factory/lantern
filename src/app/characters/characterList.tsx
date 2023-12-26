"use client";

import { Character } from "types/character";

type CharacterListProps = {
  characters: Character[];
  addCharacter: () => void;
  onCharacterClick: (key: string) => void;
};

/**
 * Renders a list of characters
 * @param characters - The list of characters to render
 * @param addCharacter - A function to add a new character
 * @param onCharacterClick - A function that runs when a character is clicked
 */
export function CharacterList(props: CharacterListProps) {
  const characterElements = props.characters.map((character: Character) => (
    <li key={character.key} onClick={() => props.onCharacterClick(character.key)}>
      {character.name}
    </li>
  ));

  return (
    <ul>
      <li onClick={props.addCharacter}>+ Add Character</li>
      {characterElements}
    </ul>
  );
}
