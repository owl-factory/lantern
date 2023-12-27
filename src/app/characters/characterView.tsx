"use client";

import { DynamicRender } from "features/dynamicRender";

type CharacterViewProps = {
  characterId: string;
};

/**
 * Renders a Dynamic Render for the given character.
 * @param character - Optional. The character to render a Dynamic View for.
 */
export function CharacterView(props: CharacterViewProps) {
  if (!props.characterId) return <></>;

  return (
    <>
      <DynamicRender id={props.characterId} />
    </>
  );
}
