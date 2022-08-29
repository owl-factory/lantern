import SandboxedCodeWorker from "../workers/sandboxed-code.worker";
import { v4 as uuid } from "uuid";
import { PromiseWebWorker } from "@owl-factory/web-worker/controllers/PromiseWebWorker";
import { WorkerAction } from "../enums/workerAction";
import { DataSource } from "../enums/dataSource";
import { SandboxWorkerSetMessage } from "../types/workers";
import { toJS } from "mobx";
import { ParsedExpressionString, RenderGroup, SheetProperties } from "../types";

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
  public async expr(
    renderIDs: RenderGroup,
    expression: ParsedExpressionString,
    properties: SheetProperties
  ) {
    if (!expression.isExpression) { return expression.value; }
    return this.post({
      renderIDs: renderIDs,
      action: WorkerAction.Expression,
      properties,
      expression: expression.value,
    });
  }

  /**
   * Stores data within the web worker for faster referencing
   * @param source The source that this data will be stored within
   * @param id The ID of the object to store the data within
   * @param value The value being stored
   * @param key The key of a subobject to store the value in, if any
   */
  public set(source: DataSource, id: string, value: unknown, key?: string) {
    const message: SandboxWorkerSetMessage = {
      action: WorkerAction.Set,
      id,
      group: source,
      value: toJS(value),
      key,
    };
    this.post(message as any);
  }
}

export const SandboxController = new $SandboxController(SandboxedCodeWorker);
