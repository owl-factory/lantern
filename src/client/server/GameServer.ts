import { makeAutoObservable } from "mobx";
import Peer, { DataConnection } from "peerjs";
import { Socket, io } from "socket.io-client";
import { MessageType } from "../../components/reroll/play/Chat";

// A single action sent to others
export interface Action {
  type: string;
  data: any;
}

export interface HostPQueue {
  peerID: string;
  isHost: boolean;
  priority: number;
}

// The state used for tracking the whole of the game
export interface GameState {
  host?: string;
  hostQueue: HostPQueue[];
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

  tableID!: string; // The ID of the table server to connect to

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

  /**
   * Connects the socket, then peer, then table.
   * @param tableID The table to connect to
   */
  public connect(tableID: string): void {
    this.tableID = tableID;

    this.socket = io(this.socketAddress);
    this.socket.on(`connect`, () => {
      this.log(`Socket successfully connected`);
      this.isSocketReady = true;

      this.peer = new Peer(this.peerID, this.peerConfig);
      this.peer.on(`open`, () => {
        this.log(`Peer successfully connected`);
        this.isPeerReady = true;
        this.joinTable();
      });
    });
    // TODO - add error handling
  }

  /**
   * Sends packaged data to all users
   * @param data The data to send to all people
   */
  public sendToAll(data: any): void {
    const keys = Object.keys(this.channels);
    keys.forEach((key: string) => {
      const channel = this.channels[key];
      channel.send(data);
    });
    this.dispatch(data);
  }

  /**
  * Updates the game state from the given action
  * @param state The previous game state
  * @param action The action taken with data and type
  */
  public dispatch(action: Action): void {
    switch (action.type) {
      case "full gamestate":
        this.gameState = action.data;
        this.onLoad()
        break;
      case "push host queue":
        this.addToHostQueue(action.data);
        break;
      case "set count":
        this.gameState.count = action.data;
        break;
      case "add message":
        this.gameState.messages.push(action.data);
        break;
      default:
        // eslint-disable-next-line no-console
        console.error(`Action '${action.type}' is invalid`);
        break;
    }
  }

  /**
   * The actions to run when assuming the role of host for the game server
   */
  protected assumeHost(): void {
    this.log(`Look at me. I'm the host now`);
    this.socket.emit(`assume-host`, this.tableID, this.peer.id);
    this.gameState.host = this.peer.id;
    // Delete previous host queue
    this.calculateHostPriority();
    this.dispatch({ type: "push host queue", data: this.hostPriority });
  }

  /**
   * Adds an item to the host queue in it's desired priority
   * @param newHostItem The new item to add to the host queue
   */
  protected addToHostQueue(newHostItem: HostPQueue): void {
    this.removeFromHostQueue(newHostItem.peerID, false);

    // Handles the only item in the thing
    if (this.gameState.hostQueue.length === 0) {
      this.gameState.hostQueue.push(newHostItem);
      this.recalculateHost();
      return;
    }

    // Adds the new host at the top of the queue by default
    // TODO - should we remove this?
    if (newHostItem.isHost === true) {
      this.gameState.hostQueue.splice(0, 0, newHostItem);
      this.recalculateHost();
      return;
    }

    this.gameState.hostQueue.forEach((hostItem: HostPQueue, index: number) => {
      if (newHostItem.priority > hostItem.priority) {
      this.gameState.hostQueue.splice(index - 1, 0, hostItem);
        this.recalculateHost();
        return;
      }
    });

    this.gameState.hostQueue.push(newHostItem);
    this.recalculateHost();
  }

  /**
   * Removes a specific user from the host queue
   * @param peerID The id of the user to remove from the host queue
   */
  protected removeFromHostQueue(peerID: string, recalculate?: boolean): void {
    this.gameState.hostQueue.forEach((hostItem: HostPQueue, index: number) => {
      if(hostItem.peerID === peerID) {
        this.gameState.hostQueue.splice(index, 1);
      }
    });

    if (recalculate) { this.recalculateHost(); }
  }

  /**
   * Rechecks if we need a new host. If this user is the new host, assume
   * the host position
   */
  protected recalculateHost(): void {
    const topQueue = this.gameState.hostQueue[0];
    if (topQueue.isHost === true) { return; }
    if (topQueue.peerID === this.peer.id) {
      this.assumeHost();
    }
  }

  /**
   * Handles joining a table and establishing all functionality required for
   * interacting within this server
   * TODO - split this function up such that the socket/peer ON events have their
   * own functions :)
   * TODO - check if we need `checkIfReady` checks
   */
  protected joinTable(): void {
    this.log(`Joining table ${this.tableID} as ${this.peer.id}`);
    this.socket.emit(`join-table`, this.tableID, this.peer.id);

    this.calculateHostPriority();

    // Catches the event of a player joining the server (`join-table`)
    this.socket.on(`player-joined`, (peerID: string, playerCount: number) => {
      this.log(`Player count: ${playerCount}`);
      this.gameState.activePlayers = playerCount;
      this.connectToPlayer(peerID);
    });

    // Handles the response from the socket server with our join information
    this.socket.on(`i-joined`, (playerCount: number) => {
      this.log(`Joined table. ${playerCount - 1} other players present`);
      this.gameState.activePlayers = playerCount;

      // Assume host if we have one player and we are not currently the host
      // For example, if we have just joined
      if (playerCount === 1 && this.gameState.host !== this.peer.id) {
        this.assumeHost();
      }
      this.checkIfReady();
    });

    // Recognizes the new host
    this.socket.on(`new-host`, (peerID: string) => {
      this.log(`${peerID} is the new host`);
      const isLosingHost = this.gameState.host === this.peer.id;
      this.gameState.host = peerID;

      if (isLosingHost) {
        this.calculateHostPriority();
        this.dispatch({ type: "push host queue", data: this.hostPriority });
      }
    });

    this.socket.on(`player-ready`, (peerID: string) => {
      this.log(`${peerID} is ready`);
    });

    // Catches the event of a socket disconnecting (`disconnect`)
    this.socket.on(`player-disconnected`, (peerID: string, playerCount: number) => {
      this.gameState.activePlayers = playerCount;
      this.removeFromHostQueue(peerID, true);
      // TODO - Remove from host queue or assume host
      this.disconnectFromPlayer(peerID);
    });

    // Catches the event of previously present players in the server
    this.peer.on(`connection`, (channel: DataConnection) => {
      this.log(`Recieving connection from ${channel.peer}`);
      this.channels[channel.peer] = channel;

      // If we have all active connections required, then we inform the
      // other players that we are ready to play
      this.checkIfReady();

      // Handles receiving data through the channel
      this.channels[channel.peer].on(`data`, (data:any) => {
        this.log(this.channels);
        this.dispatch(data);
      });
    });

    this.checkIfReady();
  }

  /**
   * Calculates this current user's priority as host for quick adding to the PQueue
   * This only needs to be done once as all information regarding their priority
   * is static, unless such an event occurs as to require the recalculation of the host
   * priority, such as in the case of someone being elevated to GM or being manually set
   */
  protected calculateHostPriority(): void {
    this.hostPriority = {
      peerID: this.peer.id,
      priority: 1,
      isHost: this.gameState.host === this.peer.id,
    };
  }

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
    this.socket.emit(`ready`, this.tableID, this.peer.id);

  }

  /**
   * Runs any and all actions that should run after recieving an update
   * from the host
   */
  protected onLoad(): void {
    this.sendToAll({ type: "push host queue", data: this.hostPriority });
  }

  /**
   * Connects to a newly joined player.
   * @param peerID The ID of the new peer to connect to
   */
  protected connectToPlayer(peerID: string): void {
    this.log(`Connecting to new player ${peerID}`);
    this.channels[peerID] = this.peer.connect(peerID);

    this.channels[peerID].on(`data`, (data:any) => {
      this.dispatch(data);
    });

    if (this.peer.id !== this.gameState.host) { return; }
    this.channels[peerID].on(`open`, () => {
      this.log(`Sending gamestate to new player`);
      this.channels[peerID].send({data: this.gameState, type: "full gamestate"});
    });
  }

  /**
   * Disconnects the current player from a specified peer
   * @param peerID The id of the peer to disconnect from
   */
  protected disconnectFromPlayer(peerID: string): void {
    this.log(`Player ${peerID} is disconnecting`);
    if (!this.channels[peerID]) { return; }
    this.channels[peerID].close();
    delete this.channels[peerID];
  }

  /**
   * A debug log for printing out logging information in testing
   * @param message The message to print
   * @param optionalParams Anything additional to print as well
   */
  protected log(message?: unknown, ...optionalParams: never[]): void {
    if (!this.debug) { return; }
    // eslint-disable-next-line no-console
    if (!optionalParams.length) { console.log(message); return; }
    // eslint-disable-next-line no-console
    console.log(message, optionalParams);
  }
}
