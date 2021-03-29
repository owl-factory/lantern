import { GameServer } from ".";
import { MockGameServer } from "../../tests/client/server/MockGameServer";

/**
 * A debug log for printing out logging information in testing
 * @param message The message to print
 * @param optionalParams Anything additional to print as well
 */
export function log(this: GameServer | MockGameServer, message?: unknown, ...optionalParams: never[]): void {
  if (!this.debug) { return; }
  // eslint-disable-next-line no-console
  if (!optionalParams.length) { console.log(message); return; }
  // eslint-disable-next-line no-console
  console.log(message, optionalParams);
}
