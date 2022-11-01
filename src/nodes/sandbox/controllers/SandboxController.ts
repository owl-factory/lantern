import SandboxedCodeWorker from "../workers/sandboxed-code.worker";
import { v4 as uuid } from "uuid";
import { PromiseWebWorker } from "@owl-factory/web-worker/controllers/PromiseWebWorker";
import { SandboxAction } from "../enums/workerAction";
import { ParsedExpression } from "types/expressions";
import { toJS } from "mobx";

// Allows for safely computing user-generated code
class $SandboxController extends PromiseWebWorker {
  protected promises: Record<string, any> = {};

  /**
   * Generates a unique ID for the promises
   */
  protected generateUniqueID(_args?: Record<string, unknown> | undefined): string { return uuid(); }

  /**
   * Handles rendering out an expression into a single string
   * @param renderIDs The render IDs used for accessing a particular render's data
   * @param expression The parsed expression to distill into a useable expression
   * @param properties The values used within the current state of the rendered sheet
   * @returns The currently stored value for the attribute
   */
  public async expr(expression: ParsedExpression, properties: Record<string, unknown>) {
    if (!expression.isExpression) { return expression.value; }
    return this.post({
      action: SandboxAction.Expression,
      properties: toJS(properties),
      expression: toJS(expression.value),
    });
  }
}

export const SandboxController = new $SandboxController(SandboxedCodeWorker);
