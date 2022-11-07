// Handles actor-specific functionality for renders

import { ActiveData } from "nodes/active-data";
import { RenderProperties } from "nodes/view-renderer/types/renderProps";
import { Scalar } from "types";

/**
 * Fetches a value for an actor input
 * @param actorID The ID of the actor to fetch a value from
 * @param field The fully qualified field being set
 * @param properties The current state of the render
 * @returns The value of the actor field or content
 */
export function getActorValue(
  actorID: string | undefined,
  field: string | undefined,
  properties: RenderProperties
) {
  if (!field || !actorID) { return ""; }
  // Actors do not and should not have any periods
  if (field.search(/\./) === -1) {
    return (ActiveData.getActor(actorID, field) || "") as Scalar;
  }

  const { contentType, index, name } = parseContentFieldArguments(field, properties);

  // Catches all failure cases where some piece of data is missing
  if (contentType === "" || index === undefined || index < 0 || name === "") { return ""; }
  const content = ActiveData.getContent(actorID, contentType, index);
  if (!content) { return ""; }
  return content[name] || "";
}

/**
 * Sets the value of an actor's field or a piece of content
 * @param actorID The ID of the actor to update
 * @param field The fully qualified field being changed
 * @param properties The current render state
 * @param value The new value to place in the field
 */
export function setActorValue(
  actorID: string | undefined,
  field: string | undefined,
  properties: RenderProperties,
  value: Scalar,
) {
  if (!field || !actorID) { return ""; }
  if (field.search(/\./) === -1) {
    ActiveData.setActor(actorID, field, value);
    return;
  }

  const { contentType, index, name } = parseContentFieldArguments(field, properties);
  const content = ActiveData.getContent(actorID, contentType, index);
  if (!content) { return; }
  content[name] = value;
  ActiveData.setContent(actorID, contentType, index, content);
}

/**
 * Parses a content field and properties into arguments for accessing the value that needs to be changed
 * @param field The value used for the input name
 * @param properties The sheet properties as they are within the form
 * @returns An object containing the contentType key, the array index, and the name of the field to set
 */
function parseContentFieldArguments(field: string, properties: RenderProperties) {
  const variableKey = field.replace(/\..+$/, "");
  const contentType = (properties.$source[variableKey] || "content.").substring(8);
  const index = properties.$index[variableKey];
  const name = field.replace(/^.+\./, "");

  return { contentType, index, name };
}
