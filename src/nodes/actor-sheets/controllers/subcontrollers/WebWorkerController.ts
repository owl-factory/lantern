import { isClient } from "@owl-factory/utilities/client";
import { newWebWorker } from "@owl-factory/web-worker";
import { action, makeObservable, observable, toJS } from "mobx";
import { DataSource } from "nodes/actor-sheets/enums/dataSource";
import { WorkerAction } from "nodes/actor-sheets/enums/workerAction";
import { RenderGroup, SheetProperties } from "nodes/actor-sheets/types";
import { ParsedExpressionString } from "nodes/actor-sheets/types/expressions";
import { MessageResponse, SandboxWorkerSetMessage } from "nodes/actor-sheets/types/workers";
import SandboxedCodeWorker from "../../workers/sandboxed-code.worker";

/**
 * Handles interactions with the Sandboxed Web Worker
 */
export class WebWorkerController {
  public $expressions: Record<string, string> = {};
  private worker!: Worker;

  constructor() {
    const worker = newWebWorker(SandboxedCodeWorker);
    if (isClient) {
      (worker as Worker).onmessage = (message: MessageEvent<MessageResponse>) => this.onMessage(message.data);
      this.worker = worker as Worker;
    }

    makeObservable(this, {
      $expressions: observable,
      onMessage: action,
      set: action,
    });
  }

  /**
   * Handles rendering out an expression into a single string
   * @param renderIDs The render IDs used for accessing a particular render's data
   * @param elementKey The key used for identifying a specific element within a render
   * @param attributeName The name of the attribute being read
   * @param expression The parsed expression to distill into a useable expression
   * @param properties The values used within the current state of the rendered sheet
   * @returns The currently stored value for the attribute
   */
  public get(
    renderIDs: RenderGroup,
    elementKey: string,
    attributeName: string,
    expression: ParsedExpressionString,
    properties: SheetProperties
  ) {
    if (!expression.isExpression) { return expression.value; }
    const key = `${elementKey}__${attributeName}`;
    this.worker.postMessage({
      renderIDs: renderIDs,
      action: WorkerAction.Expression,
      key: key,
      properties,
      expression: expression.value,
    });
    return this.$expressions[key] || "";
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
    this.worker.postMessage(message);
  }

  /**
   * Recieves a message from the sandboxed web worker containing the result of an expression
   * @param message The response back from the web worker after it calculates the expression
   */
  public onMessage(message: MessageResponse) {
    const key = message.key;
    const exprValue = this.$expressions[key];
    if (exprValue === message.value) { return; }
    this.$expressions[key] = message.value;
  }
}
