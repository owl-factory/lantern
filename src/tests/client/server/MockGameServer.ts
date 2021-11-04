import { DataConnection } from "peerjs";
import { GameState, HostPriorityQueue } from "types/reroll/play";
import * as host from "controllers/play/host";
import * as logging from "controllers/play/logging";

/**
 * A mock game server for testing purposes. This does not have any of the connection code
 * and can run successfully regardless of location
 */
export class MockGameServer {
  debug = false; // True to post debug information

  peerID?: string; // This user's starting peer ID
  peerConfig: any; // The configuration for connecting to the peer.

  socketAddress!: string; // The socket connection address

  peer!: { id: string }; // The peer object
  // socket!: Socket; // The socket object

  isPeerReady = false; // If the peer has been connected
  isSocketReady = false; // If the socket has been connected

  tableID!: string; // The ID of the table server to connect to

  // The peerID indexed object containing the channels connected to them
  channels: Record<string, DataConnection> = {};

  gameState!: GameState; // The React-updated game state that refreshes the DOM

  // The host priority of this user and their priority to host
  hostPriority!: HostPriorityQueue;

  constructor() {
    this.gameState = {
      activePlayers: 0,
      count: 0,
      entities: {},
      messages: [],
    };

    this.peer = { id: "test-id" };
  }

  // HOSTING
  public addToHostQueue = host.addToHostQueue;
  public assumeHost = host.assumeHost;
  public calculateHostPriority = host.calculateHostPriority;
  public removeFromHostQueue = host.removeFromHostQueue;
  public recalculateHost = host.recalculateHost;

  // LOGGING
  protected log = logging.log;
}
