import { MapController } from "client/maps/MapController";
import { Button } from "components/style";
import { observer } from "mobx-react-lite";
import { Application } from "pixi.js";
import React, { useEffect } from "react";
// import * as pixi from "pixi.js";

const app = new Application({
  width: 500,
  height: 500,
  backgroundColor: 0xFFFFFF,
  antialias: true
});

const MapContent = observer(() => {
  const [ mapController ] = React.useState(new MapController(app))
  const ref = React.useRef(null);

  useEffect(() => {
    if (!ref || !ref.current) { return; }
    ref.current.appendChild(app.view);
    app.start();

    // mapController = new MapController(app);

    return () => {
      app.stop();
    };
  }, []);

  return (<>
    {/* <Button type="button" onClick={mapController.setMapUnit()} */}
    <div ref={ref} />
  </>);
});

export default MapContent;