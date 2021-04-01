import React from "react";
import { CampaignDoc, UserProfileDoc } from "types";
import { Chat } from "./Chat";

import { GameServer } from "client";
import { observer } from "mobx-react-lite";
import { rest } from "utilities";
import { useRouter } from "next/router";

export enum DispatchEvent {
  // Game Handlers
  PushHostQueue,
  FullGamestate, // TODO - remove in the future
  CatchUp,
  Flush,

  // User Actions
  Test,
  Message,
}

// Indicates the type of action we're taking on a dispatch event
export interface Dispatch {
  event: DispatchEvent;
  content: any; // TODO for more specific types,
  timestamp?: number;
}


const gameServer = new GameServer();
gameServer.gameState = {
  count: 0,
  messages: [],
  activePlayers: 0,
  hostQueue: [],
  dispatchHistory: [],
};

/**
 * Renders out the playspace and server functionality
 */
export const Play = observer(() => {
  const router = useRouter();
  const [ campaign, setCampaign ] = React.useState(undefined);
  const [ user, setUser ] = React.useState(undefined);

  function test() {
    const dispatch = { event: DispatchEvent.Test, content: gameServer.gameState.count + 1 };
    gameServer.sendToAll(dispatch);
  }

  function printQueue() {
    gameServer.gameState.hostQueue.forEach((hostItem: any) => {
      console.log(hostItem.peerID)
    });
  }

  function flushDispatch() {
    gameServer.flushDispatch();
  }

  // ON LOAD
  React.useEffect(() => {
    rest.get(`/api/play/${router.query.id}`)
    .then((res: any) => {
      if (res.success) {
        setCampaign(res.data.campaign);
        setUser(res.data.user);
        gameServer.campaignID = res.data.campaign;
        gameServer.connect(res.data.campaign._id as string);

      }
    })
 
    // TODO - see if we can't remove that
  }, []);

  return (
    <div>
      Hello!<br/>
      Game ID: {gameServer.peer ? gameServer.peer.id : "..."}<br/>

      Count: {gameServer.gameState.count}
      <button onClick={test}>Test</button>
      <button onClick={printQueue}>See Queue</button>
      <button onClick={flushDispatch}>Flush Dispatch</button>
      <Chat server={gameServer} />
    </div>
  );
});

export default Play;
