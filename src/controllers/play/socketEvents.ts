import { DispatchEvent } from "types/reroll/play";
import { GameServer } from "controllers/play";

/**
 * Informs the current player that they have successfully joined the table
 * and passes along relevant information about the state of the table
 * @param playerCount The number of players now active in the table
 */
export function iJoined(this: GameServer, playerCount: number): void {
  this.log(`Joined table. ${playerCount - 1} other players present`);
  this.state.activePlayers = playerCount;

  // Assume host if we have one player and we are not currently the host
  // For example, if we have just joined
  if (playerCount === 1 && this.host !== this.peer.id) {
    this.assumeHost();
  }
  this.checkIfReady();
}

/**
 * Handles the functionality when a new player joins the game via join-table
 *
 * @param this The game server this function is part of
 * @param peerID The peer id of the player who just joined the table
 * @param playerCount The current number of players within the table
 */
export function playerJoined(this: GameServer, peerID: string, playerCount: number): void {
  this.log(`Player count: ${playerCount}`);
  this.state.activePlayers = playerCount;
  this.connectToPlayer(peerID);
}

/**
 * Handles recieving the assertion that someone is taking over as
 * host.
 * @param peerID The peer ID of the user assuming the host
 */
export function newHost(this: GameServer, peerID: string): void {
  this.log(`${peerID} is the new host`);
  const isLosingHost = this.host === this.peer.id;
  this.host = peerID;

  if (isLosingHost) {
    this.calculateHostPriority();
    this.dispatch({ event: DispatchEvent.PushHostQueue, content: this.hostPriority });
  }
}

/**
 * Indicates that a player is now ready
 * @param peerID The peer ID of the user who is now ready
 *
 * TODO - determine if this is something we want to keep
 * Perhaps a better option is to inform over dispatch
 */
export function playerReady(this: GameServer, peerID: string): void {
  this.log(`${peerID} is ready`);
}

/**
 * Handles all of the functionality when a player disconnects from the game
 * @param peerID The peer ID of the player who disconnected
 * @param playerCount The number of players now playing the game
 */
export function playerDisconnected(this: GameServer, peerID: string, playerCount: number): void {
  this.state.activePlayers = playerCount;
  this.removeFromHostQueue(peerID, true);
  this.disconnectFromPlayer(peerID);
}
