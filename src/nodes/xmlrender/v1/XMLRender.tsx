import React from "react";
import { XMLEngineAPI } from "types/interfaces/XMLEngineAPI";
import { EngineContext, KeyContext } from "./context";
import { renderChildren } from "./utilities/render";

interface XMLRenderProps {
  engine: XMLEngineAPI;
}

//llama
// Legible LAntern MArkup

/**
 * Renders processed XML into viewable HTML
 * @param engine The XMLEngine object that provides the data to make this render work
 */
export function XMLRender(props: XMLRenderProps) {
  const layout = props.engine.getLayout(); // Layout? Get Layout?

  return (
    <div>
      <EngineContext.Provider value={props.engine}>
        <KeyContext.Provider value={props.engine.getKey()}>
          {renderChildren(layout, props.engine.getKey())}
        </KeyContext.Provider>
      </EngineContext.Provider>
    </div>
  );
}
