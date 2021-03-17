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

      Count: {gameState.count}
      <button onClick={test}>Test</button>
      <Chat />
    </div>
  );
});

export default Play;
