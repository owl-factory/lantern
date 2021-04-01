import { DispatchEvent } from "components/reroll/play";
import Peer, { DataConnection } from "peerjs";
import { io } from "socket.io-client";
import { GameServer } from ".";

/**
 * Connects the socket, then peer, then table.
 * @param campaignID The campaign to connect to
 * TODO - move to a socket-only file?
 */
export function connect(this: GameServer, campaignID: string): void {
  this.campaignID = campaignID;

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
 * Connects to a newly joined player.
 * @param peerID The ID of the new peer to connect to
 */
export function connectToPlayer(this: GameServer, peerID: string): void {
  this.log(`Connecting to new player ${peerID}`);
  this.channels[peerID] = this.peer.connect(peerID);

  this.channels[peerID].on(`data`, (data:any) => {
    this.dispatch(data);
  });

  if (this.peer.id !== this.gameState.host) { return; }
  this.channels[peerID].on(`open`, () => {
    this.log(`Sending gamestate to new player`);
    this.channels[peerID].send({content: this.gameState, event: DispatchEvent.FullGamestate});
  });
}

/**
 * Disconnects the current player from a specified peer
 * @param peerID The id of the peer to disconnect from
 */
export function disconnectFromPlayer(this: GameServer, peerID: string): void {
  this.log(`Player ${peerID} is disconnecting`);
  if (!this.channels[peerID]) { return; }
  this.channels[peerID].close();
  delete this.channels[peerID];
}

/**
 * Handles joining a table and establishing all functionality required for
 * interacting within this server
 * TODO - split this function up such that the socket/peer ON events have their
 * own functions :)
 * TODO - check if we need `checkIfReady` checks
 */
export function joinTable(this: GameServer): void {
  this.log(`Joining campaign ${this.campaignID} as ${this.peer.id}`);
  this.socket.emit(`join-table`, this.campaignID, this.peer.id);

  this.calculateHostPriority();

  // Catches the event of a player joining the server (`join-table`)
  this.socket.on(`player-joined`, (peerID: string, playerCount: number) => { this.playerJoined(peerID, playerCount); });

  // Handles the response from the socket server with our join information
  this.socket.on(`i-joined`, (playerCount: number) => { this.iJoined(playerCount); });

  // Recognizes the new host
  this.socket.on(`new-host`, (peerID: string) => { this.newHost(peerID); });

  this.socket.on(`player-ready`, (peerID: string) => { this.playerReady(peerID); });

  // Catches the event of a socket disconnecting (`disconnect`)
  this.socket.on(`player-disconnected`, (peerID: string, playerCount: number) => {
    this.playerDisconnected(peerID, playerCount);
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
