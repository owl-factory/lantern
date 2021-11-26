import React from "react";
import { DispatchEvent } from "types/reroll/play";
import { Chat } from "components/reroll/play_old";

import { GameServer } from "controllers/play";
import { observer } from "mobx-react-lite";
import { rest } from "utilities/request";
import { useRouter } from "next/router";

const gameServer = new GameServer();
gameServer.state = {
  count: 0,
  entities: {},
  messages: [],
  activePlayers: 0,
};

/**
 * Renders out the playspace and server functionality
 */
export const Play = observer(() => {
  const router = useRouter();

  function test() {
    const dispatch = { event: DispatchEvent.Test, content: gameServer.state.count + 1 };
    gameServer.sendToAll(dispatch);
  }

  function flushDispatch() {
    gameServer.attemptFlush();
  }

  // ON LOAD
  React.useEffect(() => {
    rest.get(`/api/play/${router.query.ref}`)
    .then((res: any) => {
      if (res.success) {
        gameServer.state.messages = res.data.messages;
        gameServer.state.entities = {};
        console.log(gameServer.state.messages);
        gameServer.connect(res.data.campaign._id as string, res.data.userProfile);

      }
    });

    // TODO - see if we can't remove that
  }, []);

  return (
    <div>
      Hello!<br/>
      Game ID: {gameServer.getPeerID()}<br/>

      Count: {gameServer.state.count}
      <button onClick={test}>Test</button>
      {/* <button onClick={printQueue}>See Queue</button> */}
      <button onClick={flushDispatch}>Flush Dispatch</button>
      <Chat server={gameServer} />
    </div>
  );
});

export default Play;
