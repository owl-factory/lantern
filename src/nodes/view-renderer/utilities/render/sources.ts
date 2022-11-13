import { RenderSources } from "nodes/view-renderer";

/**
 * Concats the sources into a string for accessing previous renders
 * @param sources The sources used for a render
 * @returns A string of the compiled sources
 */
export function concatSources(sources: RenderSources = {}) {
  const sourceStr = `
    ac:${sources.actorID}|
    ca:${sources.campaignID}|
    co:${sources.contentID}|
    ru:${sources.rulesetID}|
    sh:${sources.sheetID}
  `;
  return sourceStr;
}
