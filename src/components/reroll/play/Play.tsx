import React from "react";
import Peer, { DataConnection } from "peerjs";
import { TableDoc, UserDoc } from "../../../types";
import { Chat } from "./Chat";
import { io } from "socket.io-client";

interface PlayProps {
  table: TableDoc;
  user: UserDoc;
}

type Channels = Record<string, DataConnection>;

const socket = io("192.168.0.195:3001");
const peer = new Peer(undefined,{
  host: '192.168.0.195',
  port: 3002,
  path: '/myapp',
});

function _connectToPlayer(peerID: string, channels: Channels, setChannels: any, handleData: any) {
  console.log(`Connecting to ${peerID}`);
  const newChannels = { ...channels };
  newChannels[peerID] = peer.connect(peerID);
  newChannels[peerID].on(`data`, (data: any) => handleData(data));
  setChannels(newChannels);
}

/**
 * Disconnects the current player from the given peer ID
 * @param peerID The peer ID that we are disconnecting from
 */
function _disconnectFromPlayer(peerID: string, channels: Channels, setChannels: any) {
  const oldChannels = { ...channels };
  if (!oldChannels[peerID]) { return; }
  delete oldChannels[peerID];
  setChannels(oldChannels);

}

function _handleData(data: any, gameState: any, setGameState: any) {
  const newGameState = { ...gameState };
  console.log(data)

  if ("count" in data) {
    newGameState.count = data.count;
  }

  if ("message" in data) {
    newGameState.messages.push(data.message);
  }

  setGameState(newGameState);
}

function _joinTable(tableID: string, newPeerChannel: (connection: DataConnection) => void) {
  console.log(`Joining table`);
  socket.emit(`join-table`, tableID, peer.id);

  peer.on(`connection`, (connection: DataConnection) => {
    newPeerChannel(connection);
  });
}

/**
 * The function to run on the creation of a new data connection
 * @param channel The new data connection
 * @param oldChannels The old collection of data connections
 * @param setChannels Updates the channels to use the new channels
 */
function _newPeerChannel(channel: DataConnection, oldChannels: Channels, setChannels: any, handleData: any) {
  console.log(`Recieved connection`);
  const newChannels = { ...oldChannels };
  newChannels[channel.peer] = channel;
  console.log(newChannels)
  console.log(channel)
  newChannels[channel.peer].on(`data`, (data: any) => handleData(data));

  setChannels(newChannels);
}


/**
 * Renders out the playspace and server functionality
 */
export function Play(props: PlayProps) {
  // The current host of the game. Tracks who is the current source of truth and
  // who updates should be sent to
  const [ host, setHost ] = React.useState<string | undefined>(undefined);
  const [ channels, setChannels ] = React.useState<Channels>({});
  const [ gameState, setGameState ] = React.useState({ count: 0, messages: [] })

  const connectToPlayer = (peerID: string) => { _connectToPlayer(peerID, channels, setChannels, handleData); };
  const disconnectFromPlayer = (peerID: string) => { _disconnectFromPlayer(peerID, channels, setChannels)}
  const handleData = (data: any) => { _handleData(data, gameState, setGameState)}
  const joinTable = () => { _joinTable(props.table._id, newPeerChannel); };
  const newPeerChannel = (channel: DataConnection) => { _newPeerChannel(channel, channels, setChannels, handleData); };

  // /**
  //  * Logic that forces the current player as the host.
  //  */
  // function assumeHost() {
  //   if (host === peer.id) { console.warn(`You already are the current host`); return; }
  //   socket.emit(`assume-host`, props.table._id, peer.id);
  //   setHost(peer.id);
  // }

  function test() {
    const channelKeys = Object.keys(channels);
    channelKeys.forEach((key: string) => {
      const channel = channels[key];
      channel.send({ count: gameState.count + 1 });
    });
    setGameState({...gameState, count: gameState.count + 1 })
  }


  // ON LOAD
  React.useEffect(() => {
    // Current player is connected to the Peer server
    peer.on(`open`, () => {
      joinTable();
    });

    socket.on(`player-joined`, (peerID: string) => {
      connectToPlayer(peerID);
    });

    socket.on(`player-disconnected`, (peerID: string) => {
      disconnectFromPlayer(peerID);
    });

    return () => {socket.disconnect(); peer.disconnect();};
  }, []);

  return (
    <div>
      Hello!<br/>
      My ID is: {peer.id}<br/>
      {/* <button onClick={assumeHost}>Assume Host</button><br/> */}
      I am {peer.id === host ? "" : "not "} the current host!<br/>
      {/* <Chat peer={peer} host={host}/> */}
      Count: {gameState.count}
      <button onClick={test}>Test</button>
      <Chat channels={channels} data={gameState} setGameState={setGameState}/>
      {/* <Counter channels={channels.count}/> */}
    </div>
  );
}

export default Play;
