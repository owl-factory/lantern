import { MediatorContents, MediatorHandler, MediatorMessage } from "../types/mediator";

/**
 * The base Mediator class used for communication between different
 */
export class $Mediator {
  // Mapping between the MediatorMessage enum and actions to take
  protected handler: MediatorHandler = {};

  public set(handler: MediatorHandler) {
    this.handler = handler;
  }

  public reset() { this.handler = {}; }

  /**
   * Recieves a message from a service and runs it through the appropriate handler
   * @param message The type of message this post is making
   * @param contents The contents of the message
   */
  public async send(message: MediatorMessage, source: string, contents: Partial<MediatorContents>): Promise<unknown> {
    contents.source = source;
    const handler = this.handler[message];
    if (handler === undefined) {
      // TODO - do something?
      return;
    }
    try {
      return handler(contents as MediatorContents);
    } catch (e) {
      console.error(e);
      return;
    }
  }
}

export const Mediator = new $Mediator();
