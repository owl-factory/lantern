import { useContext } from "react";
import { DynamicContext } from "../context/dynamicContext";
import { TextInput } from "./form/TextInput";

/**
 * Renders the Sheet portion of a DynamicRender
 */
export function DynamicSheet() {
  const { storage } = useContext(DynamicContext);

  let characterName: string = storage.get<string>({ source: "character", key: "name" }) ?? "";
  if (typeof characterName !== "string") characterName = "";

  return <TextInput />;
}
