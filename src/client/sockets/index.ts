import Peer, { DataConnection } from "peerjs";
import React from 'react';
import { Socket, io } from "socket.io-client";
import { GameState } from "../../components/reroll/play/GameStateProvider";

export class GameServer {
  debug = false; // True to post debug information

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

  serverState: any = {}; //
  gameState!: GameState; // The React-updated game state that refreshes the DOM
  gameDispatch!: React.Dispatch<any>; // Updates the gameState

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
    this.log(`Send to all`)
    const keys = Object.keys(this.channels);
    keys.forEach((key: string) => {
      const channel = this.channels[key];
      channel.send(data);
    });
  }

  /**
   * Handles joining a table and establishing all functionality required for
   * interacting within this server
   */
  protected joinTable(): void {
    this.log(`Joining table ${this.tableID} as ${this.peer.id}`);
    this.socket.emit(`join-table`, this.tableID, this.peer.id);

    // Catches the event of a player joining the server (`join-table`)
    this.socket.on(`player-joined`, (peerID: string) => {
      this.connectToPlayer(peerID);
    });

    // Catches the event of a socket disconnecting (`disconnect`)
    this.socket.on(`player-disconnected`, (peerID: string) => {
      this.disconnectFromPlayer(peerID);
    });

    // Catches the event of previously present players in the server
    this.peer.on(`connection`, (channel: DataConnection) => {
      this.log(`Recieving connection from ${channel.peer}`);
      this.channels[channel.peer] = channel;

      // Handles receiving data through the channel
      this.channels[channel.peer].on(`data`, (data:any) => {
        this.log(this.channels);
        this.gameDispatch(data);
      });
    });
  }

  /**
   * Connects to a newly joined player.
   * @param peerID The ID of the new peer to connect to
   */
  protected connectToPlayer(peerID: string): void {
    this.log(`Connecting to new player ${peerID}`);
    this.channels[peerID] = this.peer.connect(peerID);

    this.channels[peerID].on(`data`, (data:any) => {
      this.log(this.channels);
      this.gameDispatch(data);
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
  protected log(message?: any, ...optionalParams: any[]): void {
    if (!this.debug) { return; }
    if (!optionalParams.length) { console.log(message); return; }
    console.log(message, optionalParams);
  }
}
