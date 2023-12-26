"use client";

import { Character } from "types/character";

type CharacterViewProps = {
  character?: Character;
};

/**
 * Renders a Dynamic Render for the given character.
 * @param character - Optional. The character to render a Dynamic View for.
 */
export function CharacterView(props: CharacterViewProps) {
  if (!props.character) return <></>;

  return (
    <>
      <h1>{props.character.name}</h1>
    </>
  );
}
