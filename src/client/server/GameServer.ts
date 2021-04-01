import { Dispatch, DispatchEvent } from "components/reroll/play";
import { makeAutoObservable } from "mobx";
import Peer, { DataConnection } from "peerjs";
import { Socket } from "socket.io-client";
import { MessageType } from "../../components/reroll/play/Chat";
import * as connection from "./connection";
import * as dispatch from "./dispatch";
import * as host from "./host";
import * as logging from "./logging";
import * as send from "./send";
import * as socketEvents from "./socketEvents";

export interface HostPQueue {
  peerID: string;
  isHost: boolean;
  priority: number;
}

// The state used for tracking the whole of the game
export interface GameState {
  host?: string;
  hostQueue: HostPQueue[];
  dispatchHistory: Dispatch[];
  activePlayers: number;
  count: number;
  messages: MessageType[];
}

/**
 * All of the game server functionality
 */
export class GameServer {
  debug = true; // True to post debug information

  peerID?: string; // This user's starting peer ID
  peerConfig: any; // The configuration for connecting to the peer.

  socketAddress: string; // The socket connection address

  peer!: Peer; // The peer object
  socket!: Socket; // The socket object

  isPeerReady = false; // If the peer has been connected
  isSocketReady = false; // If the socket has been connected

  campaignID!: string; // The ID of the table server to connect to

  // The peerID indexed object containing the channels connected to them
  channels: Record<string, DataConnection> = {};

  gameState!: GameState; // The React-updated game state that refreshes the DOM

  // The host priority of this user and their priority to host
  hostPriority!: HostPQueue;

  /**
   * Sets the default information for the socket and peer connection
   */
  constructor() {
    this.socketAddress = "192.168.0.195:3001";
    this.peerID = undefined;
    this.peerConfig = {
      host: '192.168.0.195',
      port: 3002,
      path: '/myapp',
    };
    makeAutoObservable(this);
  }

  // CONNECTION LOGIC
  public connect = connection.connect;
  protected connectToPlayer = connection.connectToPlayer;
  protected disconnectFromPlayer = connection.disconnectFromPlayer;
  protected joinTable = connection.joinTable;

  // DISPATCH FUNCTIONALITY
  public dispatch = dispatch.dispatch;
  public flushDispatch = dispatch.flushDispatch;

  // HOST FUNCTIONALITY
  protected addToHostQueue = host.addToHostQueue;
  protected assumeHost = host.assumeHost;
  protected calculateHostPriority = host.calculateHostPriority;
  protected removeFromHostQueue = host.removeFromHostQueue;
  protected recalculateHost = host.recalculateHost;

  /**
   * Checks if the current player is ready.
   * Metrics used are the active players less one is equal to the number of active
   * channels
   */
  protected checkIfReady(): void {
    if (Object.keys(this.channels).length === (this.gameState.activePlayers - 1)) {
      this.onReady();
    }
  }

  /**
   * Actions to run when this user is ready
   */
  protected onReady(): void {
    this.log(`I am ready to play`);
    this.socket.emit(`ready`, this.campaignID, this.peer.id);
  }

  /**
   * Runs any and all actions that should run after recieving an update
   * from the host
   */
  protected onLoad(): void {
    this.sendToAll({ event: DispatchEvent.PushHostQueue, content: this.hostPriority });
  }

  // LOGGING
  protected log = logging.log;

  // SOCKET EVENTS
  protected iJoined = socketEvents.iJoined;
  protected newHost = socketEvents.newHost;
  protected playerDisconnected = socketEvents.playerDisconnected;
  protected playerJoined = socketEvents.playerJoined;
  protected playerReady = socketEvents.playerReady;

  // SEND FUNCTIONALITY
  public sendToAll = send.sendToAll;
}
