import { setGlobalOptions } from "@typegoose/typegoose";
import Peer, { DataConnection } from "peerjs";
import React, {useContext, useReducer} from 'react';
import { Socket, io } from "socket.io-client";
import { GameState, GameStateContext } from "../../components/reroll/play/GameStateProvider";

export class GameServer {
  debug = true;

  peerID?: string;
  peerConfig: any;

  socketAddress: string;

  peer!: Peer;
  socket!: Socket;

  isPeerReady = false;
  isSocketReady = false;

  tableID!: string;
  channels: Record<string, DataConnection> = {};

  gameState: GameState;
  gameDispatch: React.Dispatch<any>;

  constructor(gameState: GameState, gameDispatch: React.Dispatch<any>) {
    this.gameState = gameState;
    this.gameDispatch = gameDispatch;
    this.socketAddress = "192.168.0.195:3001";
    this.peerID = undefined;
    this.peerConfig = {
      host: '192.168.0.195',
      port: 3002,
      path: '/myapp',
    };
  }

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
  }

  public sendToAll(data: any) {
    const keys = Object.keys(this.channels);
    keys.forEach((key: string) => {
      const channel = this.channels[key];
      channel.send(data);
    });
  }

  protected joinTable(): void {
    this.log(`Joining table ${this.tableID} as ${this.peer.id}`);
    this.socket.emit(`join-table`, this.tableID, this.peer.id);

    this.socket.on(`player-joined`, (peerID: string) => {
      this.connectToPlayer(peerID);
    });

    this.socket.on(`player-disconnected`, (peerID: string) => {
      this.disconnectFromPlayer(peerID);
    });

    this.peer.on(`connection`, (channel: DataConnection) => {
      this.log(`Recieving connection from ${channel.peer}`);
      this.channels[channel.peer] = channel;

      this.channels[channel.peer].on(`data`, (data:any) => (this.gameDispatch(data)));
    });
  }

  protected connectToPlayer(peerID: string): void {
    this.log(`Connecting to new player ${peerID}`)
    this.channels[peerID] = this.peer.connect(peerID);

    this.channels[peerID].on(`data`, (data:any) => (this.gameDispatch(data)));
  }

  protected disconnectFromPlayer(peerID: string): void {
    this.log(`Player ${peerID} is disconnecting`)
    if (!this.channels[peerID]) { return; }
    this.channels[peerID].close();
    delete this.channels[peerID];
  }

  protected log(message?: any, ...optionalParams: any[]) {
    if (!this.debug) { return; }
    if (!optionalParams.length) { console.log(message); return; }
    console.log(message, optionalParams);
  }
}
