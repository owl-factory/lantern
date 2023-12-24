import { makeAutoObservable } from "mobx";
import Peer, { DataConnection, PeerJSOption } from "peerjs";
import { Socket } from "socket.io-client";
import { UserDocument } from "types/documents";
import { Dispatch, DispatchEvent, GameState, HostPriorityQueue } from "types/lantern/play";
import * as connection from "controllers/play/connection";
import * as dispatch from "controllers/play/dispatch";
import * as host from "controllers/play/host";
import * as logging from "controllers/play/logging";
import * as message from "controllers/play/message";
import * as socketEvents from "controllers/play/socketEvents";

/**
 * All of the game server functionality
 */
export class GameServer {
  protected debug = true; // True to post debug information

  protected peerID?: string; // This connection's peer ID
  protected peerConfig: PeerJSOption; // The configuration for connecting to the peer.

  protected socketAddress: string; // The socket connection address

  protected peer!: Peer; // The peer object
  protected socket!: Socket; // The socket object

  public isReady = false;
  public fatalError = ""; // Indicates if this play session has had a fatal error.

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
  protected buildDispatch = dispatch.buildDispatch;
  public dispatchToAll = dispatch.dispatchToAll;
  public dispatchToOne = dispatch.dispatchToOne;
  protected receiveDispatchHistory = dispatch.receiveDispatchHistory;
  public handleDispatch = dispatch.handleDispatch;
  public beginDispatchFlush = () => (undefined); // dispatch.beginDispatchFlush;
  public flushDispatchHistory = dispatch.flushDispatchHistory;


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
    this.dispatchToAll({ event: DispatchEvent.HostQueueItem, content: this.hostPriority });
  }

  // LOGGING
  protected log = logging.log;

  // SOCKET EVENTS
  protected iJoined = socketEvents.iJoined;
  protected newHost = socketEvents.newHost;
  protected playerDisconnected = socketEvents.playerDisconnected;
  protected playerJoined = socketEvents.playerJoined;
  protected playerReady = socketEvents.playerReady;

  // MESSAGE FUNCTIONALITY
  public fireTextMessage = message.fireTextMessage;

  public getPeerID(): string | undefined {
    if (!this.peer) { return undefined; }
    return this.peer.id;
  }
}
