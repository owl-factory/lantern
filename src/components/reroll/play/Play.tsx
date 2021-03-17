import React from "react";
import { TableDoc, UserDoc } from "../../../types";
import { Chat } from "./Chat";

import { GameServer } from "../../../client";
import { observer } from "mobx-react-lite";

interface PlayProps {
  table: TableDoc;
  user: UserDoc;
}

const gameServer = new GameServer();
gameServer.gameState = {
  count: 0,
  messages: [],
  activePlayers: 0,
  hostQueue: [],
};

/**
 * Renders out the playspace and server functionality
 */
export const Play = observer((props: PlayProps) => {

  function test() {
    const dispatch = { type: "set count", data: gameServer.gameState.count + 1 };
    gameServer.sendToAll(dispatch);
    gameServer.dispatch(dispatch);
  }

  function printQueue() {
    gameServer.gameState.hostQueue.forEach((hostItem: any) => {
      console.log(hostItem.peerID)
    });
  }

  // ON LOAD
  React.useEffect(() => {
    gameServer.connect(props.table._id);
  }, []);

  return (
    <div>
      Hello!<br/>
      Game ID: {gameServer.peer ? gameServer.peer.id : "..."}<br/>

      Count: {gameServer.gameState.count}
      <button onClick={test}>Test</button>
      <button onClick={printQueue}>See Queue</button>
      <Chat server={gameServer} />
    </div>
  );
});

export default Play;
