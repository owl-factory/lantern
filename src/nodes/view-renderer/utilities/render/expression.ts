import { set } from "@owl-factory/utilities/objects";
import { ActiveData } from "nodes/active-data";
import { Mediator } from "nodes/mediator";
import { MediatorRequest } from "nodes/mediator/types/mediator";
import { ExpressionVariableType } from "nodes/view-renderer/enums/expressionVariableType";
import { Expression } from "nodes/view-renderer/types/expression";
import { RenderSources } from "nodes/view-renderer/types/render";

export async function runExpression(
  sources: RenderSources,
  expr: Expression,
  properties: Record<string, unknown>
): Promise<string> {
  // Skip any calculation if this isn't an expression
  if (!expr.isExpression) { return expr.value; }
  const exprVariables = fetchExpressionRequirements(sources, expr);
  console.log("expr vars", exprVariables)
  properties.character = exprVariables.character || {};
  properties.content = exprVariables.content || {};
  properties.rules = exprVariables.rules || {};
  properties.sheet = exprVariables.sheet || {};
  console.log("properties", properties)

  const res = (await Mediator.requests(MediatorRequest.SandboxExpr, {expression: expr, properties})) as string;

  // Remove old content to prevent leaking
  delete properties.character;
  delete properties.content;
  delete properties.rules;
  delete properties.sheet;

  return res;
}

/**
 * Fetches an array of values used for this variable. Used to watch for changes upstream
 * @param sources The sources for these values
 * @param expr The expression that uses these values
 */
export function fetchExpressionValues(sources: RenderSources, expr: Expression): unknown[] {
  const expressionValues: unknown[] = [];
  if (!expr.isExpression) return expressionValues;

  const requiredVariables = fetchExpressionVariables(sources, expr);
  const keys = Object.keys(requiredVariables);
  for (const key of keys) {
    const requiredVariable = requiredVariables[key];
    expressionValues.push(requiredVariable);
  }

  return expressionValues;
}

export function fetchExpressionRequirements(sources: RenderSources, expr: Expression): Record<string, unknown> {
  const requirements: Record<string, unknown> = {};
  const requiredVariables = fetchExpressionVariables(sources, expr);
  console.log("req vars", expr, requiredVariables)
  const keys = Object.keys(requiredVariables);
  for (const key of keys) {
    const requiredVariable = requiredVariables[key];
    set(requirements, key, requiredVariable);
  }
  console.log('requirements', requirements)
  return requirements;
}

/**
 * Fetches the required variables used within an expression
 * @param expr The expression description containing which variables to request, if any
 * @returns An object of the variables placed appropriately within, or an array of the values
 */
function fetchExpressionVariables(sources: RenderSources, expr: Expression): Record<string, unknown> {
  if (!expr.isExpression) return {};
  const variableValues: Record<string, unknown> = {};
  console.log(expr.variables)
  for (const variable of expr.variables || []) {
    switch (variable.type) {
      case ExpressionVariableType.Actor:
        let actorValue;
        // Fetch actor value only if the ID and field are set. Anything else present is an automatic undefined
        if (sources.actorID && variable.field && variable.index === undefined && variable.contentField === undefined) {
          actorValue = ActiveData.getActor(sources.actorID, variable.field);
        }
        variableValues[variable.fullVariable] = actorValue;
        break;

      case ExpressionVariableType.Content:
        let contentValue;
        if (sources.actorID && variable.field && variable.index !== undefined) {
          if (variable.contentField === undefined) {
            contentValue = ActiveData.getContent(sources.actorID, variable.field, variable.index);
          } else {
            contentValue = ActiveData.getContentField(sources.actorID, variable.field, variable.index, variable.field);
          }
        }
        variableValues[variable.fullVariable] = contentValue;
        break;
      default:
        // TODO - implement other types
        break;
    }
  }

  return variableValues;
}
