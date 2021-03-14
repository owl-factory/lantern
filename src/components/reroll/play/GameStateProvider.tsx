import React, {createContext, useContext, useReducer} from 'react';
import { GameServer } from '../../../client/sockets/GameServer';
import { MessageType } from './Chat';

export interface GameState {
  count: number;
  messages: MessageType[];
  server?: GameServer;
}

export interface Action {
  type: string;
  data: any;
}

export type GameStateContextType = [ GameState, React.Dispatch<any> ];

const gameState: GameState = { count: 0, messages: [] };

const GameStateContext = createContext<GameStateContextType | null>(null);

function gameStateReducer(state: GameState, action: Action) {
  switch (action.type) {
    case "set count":
      return { ...state, count: action.data };
    case "set server":
      return { ...state, server: action.data };
    case "add message":
      let messages = state.messages;
      messages.push(action.data);
      return { ...state, messages };
    default:
      throw new Error("Not a valid game state reducer action.");
  }
}

export function GameStateProvider({ children }: any) {
  const [state, dispatch] = useReducer(gameStateReducer, gameState);
  return <GameStateContext.Provider value={[ state, dispatch ]}>{children}</GameStateContext.Provider>;
};

export function useGameState() {
  const ctx = useContext(GameStateContext);
  if (ctx == null) {
    throw new Error("No GameStateProvider is available to this component.") 
  } else {
    return ctx;
  }
}
