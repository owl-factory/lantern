import React from "react";
import { TableDoc, UserDoc } from "../../../types";
import { Chat } from "./Chat";
import { GameServer } from "../../../client/sockets/GameServer";
import { observer } from "mobx-react-lite";

interface PlayProps {
  table: TableDoc;
  user: UserDoc;
}

const gameServer = new GameServer();

/**
 * Renders out the playspace and server functionality
 */
export const Play = observer((props: PlayProps) => {

  function test() {
    const dispatch = { type: "set count", data: gameServer.gameState.count + 1 };
    gameServer.sendToAll(dispatch);
    gameServer.dispatch(dispatch);
  }

  // ON LOAD
  React.useEffect(() => {
    gameServer.connect(props.table._id);
  }, []);

  return (
    <div>
      Hello!<br/>
      {/* My ID is: {peer.id}<br/> */}
      {/* <button onClick={assumeHost}>Assume Host</button><br/> */}
      {/* I am {peer.id === host ? "" : "not "} the current host!<br/> */}
      {/* <Chat peer={peer} host={host}/> */}
      Count: {gameServer.gameState.count}
      <button onClick={test}>Test</button>
      <Chat server={gameServer} />
      {/* <Counter channels={channels.count}/> */}
    </div>
  );
});

export default Play;
