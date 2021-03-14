import React, {createContext, useReducer} from 'react';

export interface GameState {
  count: number;
  messages: string[];
}

export type GameStateContextType = [ GameState, React.Dispatch<any> ];

const gameState = { count: 0, messages: [] };

export const GameStateContext = createContext<GameStateContextType>();

function gameStateReducer(state: GameState, action: any) {
  switch (action.type) {
    case "set count":
      return { ...state, count: action.data };
    default:
      throw new Error();
  }
}

export const GameStateProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(gameStateReducer, gameState);
  return <GameStateContext.Provider value={[ state, dispatch ]}>{children}</GameStateContext.Provider>;
};
