import { Dispatch, DispatchEvent, GameState, HostPriorityQueue, UserDocument } from "types";
import { makeAutoObservable } from "mobx";
import Peer, { DataConnection } from "peerjs";
import { Socket } from "socket.io-client";
import * as connection from "./connection";
import * as dispatch from "./dispatch";
import * as host from "./host";
import * as logging from "./logging";
import * as message from "./message";
import * as send from "./send";
import * as socketEvents from "./socketEvents";

/**
 * All of the game server functionality
 */
export class GameServer {
  protected debug = true; // True to post debug information

  protected peerID?: string; // This connection's peer ID
  protected peerConfig: any; // The configuration for connecting to the peer.

  protected socketAddress: string; // The socket connection address

  protected peer!: Peer; // The peer object
  protected socket!: Socket; // The socket object

  public isReady = false;

  protected host?: string; // The peer ID of the current host
  protected hostPriority?: HostPriorityQueue; // The priority of this connection to assume host
  protected hostQueue: HostPriorityQueue[] = [];

  protected dispatchHistory: Dispatch[] = [];

  protected campaignID!: string; // The ID of the table server to connect to
  public user!: UserDocument;

  // The peerID indexed object containing the channels connected to them
  protected channels: Record<string, DataConnection> = {};

  state!: GameState; // The React-updated game state that refreshes the DOM

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

  // HOST FUNCTIONALITY
  protected addToHostQueue = host.addToHostQueue;
  protected assumeHost = host.assumeHost;
  protected calculateHostPriority = host.calculateHostPriority;
  protected removeFromHostQueue = host.removeFromHostQueue;
  protected recalculateHost = host.recalculateHost;

  // DISPATCH FUNCTIONALITY
  public dispatch = dispatch.dispatch;
  public attemptFlush = dispatch.attemptFlush;
  public cleanDispatchHistory = dispatch.cleanDispatchHistory;


  /**
   * Checks if the current player is ready.
   * Metrics used are the active players less one is equal to the number of active
   * channels
   */
  protected checkIfReady(): void {
    if (Object.keys(this.channels).length === (this.state.activePlayers - 1)) {
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

  // MESSAGE FUNCTIONALITY
  public fireTextMessage = message.fireTextMessage;

  public getPeerID(): string | undefined {
    if (!this.peer) { return undefined; }
    return this.peer.id;
  }
}
