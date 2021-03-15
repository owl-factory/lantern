import React, { useContext } from "react";
import { TableDoc, UserDoc } from "../../../types";
import { Chat } from "./Chat";
import { GameServer } from "../../../client";
import { GameStateProvider, useGameState } from "../../../components/reroll/play/GameStateProvider";

interface PlayProps {
  table: TableDoc;
  user: UserDoc;
}

function PlayWrapper(props: PlayProps) {
  return (
    <GameStateProvider>
      <Play {...props}/>
    </GameStateProvider>
  );
}

const gameServer = new GameServer();

/**
 * Renders out the playspace and server functionality
 */
export function Play(props: PlayProps): JSX.Element {
  const [ gameState, gameDispatch ] = useGameState();

  function test() {
    const dispatch = { type: "set count", data: gameState.count + 1 };
    gameServer.sendToAll(dispatch);
    gameDispatch(dispatch);
  }

  // ON LOAD
  React.useEffect(() => {
    gameServer.gameState = gameState;
    gameServer.gameDispatch = gameDispatch;
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
}

export default PlayWrapper;
