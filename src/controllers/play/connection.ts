import Peer, { DataConnection } from "peerjs";
import { io } from "socket.io-client";
import { GameServer } from "controllers/play";
import { UserDocument } from "types/documents";
import { Dispatch, DispatchEvent } from "types/lantern/play";

// TODO - move into a node
// TODO - create a PeerJS connection

/**
 * Runs all of the actions required to connect the current player to the socket, peer, and table.
 * As each depends on the previous action, there are layers to the connection implementation
 * @param campaignID The campaign to connect to
 */
export function connect(this: GameServer, campaignID: string, user: UserDocument): void {
  // TODO - have seperate set functions for these
  this.campaignID = campaignID;
  this.user = user;

  this.socket = io(this.socketAddress);
  this.socket.on(`connect`, () => {
    this.log(`Socket successfully connected`);

    this.peer = new Peer(this.peerID, this.peerConfig);
    this.peer.on(`open`, () => {
      this.log(`Peer successfully connected`);
      this.joinTable();
    });

    // Handles errors with the peer server and connection
    // TODO - better handling?
    this.peer.on(`error`, (err: Record<string, unknown>) => {
      switch(err.type) {
        case `browser-incompatible`:
        case `invalid-id`:
        case `invalid-key`:
        case `ssl-incompatible`:
        case `server-error`:
        case `socket-error`:
        case `socket-closed`:
          this.fatalError = `An error with the Peer server has occurred.`;
          // eslint-disable-next-line no-console
          console.error(err);
          return;
        default:
          // eslint-disable-next-line no-console
          console.warn(err);
      }
    });
  });

  // Handles issues with the socket
  this.socket.on(`connect_error`, () => {
    this.fatalError = `The socket failed to connect to the server.`;
  });

  this.socket.on(`connect_timeout`, () => {
    this.fatalError = `The socket failed to connect to the server within the timeout period.`;
  });
}

/**
 * Connects to a newly joined player.
 * @param peerID The ID of the new peer to connect to
 */
export function connectToPlayer(this: GameServer, peerID: string): void {
  this.log(`Connecting to new player ${peerID}`);
  this.channels[peerID] = this.peer.connect(peerID);

  this.channels[peerID].on(`data`, (data: Dispatch) => {
    this.handleDispatch(data);
  });

  if (this.peer.id !== this.host) { return; }
  // TODO - remove the full gamestate!
  this.channels[peerID].on(`open`, () => {
    this.log(`Sending gamestate to new player`);
    this.dispatchToOne(peerID, {
      event: DispatchEvent.DispatchHistory,
      content: {
        hostQueue: this.hostQueue,
        hostDispatchedAt: new Date(),
        history: this.dispatchHistory,
      },
    }, false);
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
 * TODO - check if we need `checkIfReady` checks
 */
export function joinTable(this: GameServer): void {
  this.log(`Joining campaign ${this.campaignID} as ${this.peer.id}`);
  this.socket.emit(`join-table`, this.campaignID, this.peer.id);
  this.isReady = true;

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
    this.channels[channel.peer].on(`data`, (data: Dispatch) => {
      this.log(this.channels);
      this.handleDispatch(data);
    });
  });

  this.checkIfReady();
}
