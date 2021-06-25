import { observer } from "mobx-react-lite";
import { Application } from "pixi.js";
import React, { useEffect } from "react";
// import * as pixi from "pixi.js";

const app = new Application({
  width: 800,
  height: 600,
  backgroundColor: 0xFFFFFF,
  antialias: true
});

interface XYCoords {
  x: number;
  y: number;
}

const MapContent = observer(() => {
  const ref = React.useRef(null);
  let mapController: MapController;

  useEffect(() => {
    if (!ref || !ref.current) { return; }
    ref.current.appendChild(app.view);
    app.start();



    return () => {
      app.stop();
    };
  }, []);

  return <div ref={ref} />;
});

export default MapContent;