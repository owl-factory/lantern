import { GameServer } from "client/play";

/**
 * A debug log for printing out logging information in testing
 * @param message The message to print
 * @param optionalParams Anything additional to print as well
 */
export function log(this: GameServer, message?: unknown, ...optionalParams: never[]): void {
  if (!this.debug) { return; }
  // eslint-disable-next-line no-console
  if (!optionalParams.length) { console.log(message); return; }
  // eslint-disable-next-line no-console
  console.log(message, optionalParams);
}
