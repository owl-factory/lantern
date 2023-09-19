import { createContext } from "react";
import { NullXMLEngineAPI, XMLEngineAPI } from "types/interfaces/XMLEngineAPI";

export const EngineContext = createContext<XMLEngineAPI>(new NullXMLEngineAPI());

// KeyContext is used for tracking and building an ever-growing key such that
// React can be aware of everything that needs to update and everything that doesn't
export const KeyContext = createContext<string>("");
