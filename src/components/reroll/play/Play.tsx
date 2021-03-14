import React, { useContext } from "react";
import { DataConnection } from "peerjs";
import { TableDoc, UserDoc } from "../../../types";
import { Chat } from "./Chat";
import { GameServer } from "../../../client/sockets";
import { GameStateProvider, GameStateContext } from "../../../components/reroll/play/GameStateProvider";

interface PlayProps {
  table: TableDoc;
  user: UserDoc;
}

type Channels = Record<string, DataConnection>;

function PlayWrapper(props: PlayProps) {
  return (
    <GameStateProvider>
      <Play {...props}/>
    </GameStateProvider>
  );
}

/**
 * Renders out the playspace and server functionality
 */
export function Play(props: PlayProps) {
  // The current host of the game. Tracks who is the current source of truth and
  // who updates should be sent to
  const [ host, setHost ] = React.useState<string | undefined>(undefined);
  const [ channels, setChannels ] = React.useState({});
  const [ gameState, gameDispatch ] = useContext(GameStateContext);
  const gameServer = new GameServer(gameState, gameDispatch);

  // /**
  //  * Logic that forces the current player as the host.
  //  */
  // function assumeHost() {
  //   if (host === peer.id) { console.warn(`You already are the current host`); return; }
  //   socket.emit(`assume-host`, props.table._id, peer.id);
  //   setHost(peer.id);
  // }

  function test() {
    const dispatch = { type: "set count", data: gameState.count + 1 };
    gameDispatch(dispatch);
    gameServer.sendToAll(dispatch);
  }

  // ON LOAD
  React.useEffect(() => {
    gameServer.connect(props.table._id);

    // Current player is connected to the Peer server
    // peer.on(`open`, () => {
    //   joinTable();
    // });

    // socket.on(`player-joined`, (peerID: string) => {
    //   connectToPlayer(peerID);
    // });

    // socket.on(`player-disconnected`, (peerID: string) => {
    //   disconnectFromPlayer(peerID);
    // });

    // return () => {socket.disconnect(); peer.disconnect();};
  }, []);

  return (
    <div>
      Hello!<br/>
      {/* My ID is: {peer.id}<br/> */}
      {/* <button onClick={assumeHost}>Assume Host</button><br/> */}
      {/* I am {peer.id === host ? "" : "not "} the current host!<br/> */}
      {/* <Chat peer={peer} host={host}/> */}
      Count: {gameState.count}
      <button onClick={test}>Test</button>
      {/*<Chat channels={channels} />*/}
      {/* <Counter channels={channels.count}/> */}
    </div>
  );
}

export default PlayWrapper;
