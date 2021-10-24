import { Button } from "components/style";
import { Drawer, DrawerContent } from "components/style/drawer/Drawer";
import { observer } from "mobx-react-lite";
import React from "react";
import { MdGridOn, MdImage, MdSupervisorAccount } from "react-icons/md";
import { ImageDocument } from "types/documents";
import { ImageList, ListFormat } from "../library";
import { GridForm } from "./forms/grid";
import { MapModeReadable as MAP_MODE_READABLE, MapMode, ModeController } from "controllers/scenes/mode";
import styles from "./SceneOverlay.module.scss";
import { ButtonGroup } from "react-bootstrap";
import { MapDraggable } from "controllers/scenes/map";


function dragStart(event: any) {
  event.dataTransfer.setData("id", event.target.id);
  event.dataTransfer.setData("type", MapDraggable.Image);
}

function SceneDrawer() {
  return (
    <Drawer >
      <DrawerContent name="Grid Sizing" Icon={MdGridOn}><GridForm/></DrawerContent>
      <DrawerContent name="Images" Icon={MdImage}>
        <div draggable="true" id="302509464430313988" onDragStart={dragStart}>
          <img draggable="false" src="/dev/images/sprites/waals_brodnen_death_sprite.png"/>Waals Brodnen
        </div>
        {/* <ImageList
        listFormat={ListFormat.Icons}
        onClick={(image: ImageDocument) => sceneController.addProp(sceneController, image)}/> */}
      </DrawerContent>
      <DrawerContent name="Characters" Icon={MdSupervisorAccount}>
        Nothing yet
      </DrawerContent>
    </Drawer>
  );
}

const MAP_MODES = [
  { mode: MapMode.Select, name: "Select" },
  { mode: MapMode.Pan, name: "Pan" },
];

const MapModeButtons = observer(() => {
  const buttons: JSX.Element[] = [];
  MAP_MODES.forEach((mode: any) => {
    buttons.push(
      <Button
        key={mode.mode}
        className={`${ModeController.mode === mode.mode ? "active" : ""}`}
        onClick={() => ModeController.setMode(mode.mode) }>
        {mode.name}
      </Button>
    );
  });

  return (
    <ButtonGroup className={styles.mapModeButtons} style={{position: "absolute"}}>
      {buttons}
    </ButtonGroup>
  );
});

/**
 * Renders a wrapper that surrounds a scene, applying UI for interaction with the Scene
 */
export function SceneOverlay({ children }: any): JSX.Element {

  return (
    <div className={styles.sceneOverlay}>
      <SceneDrawer/>
      <MapModeButtons/>
      <div>
        {/* <Button className="sm" onClick={addSprite}>Add Image</Button> */}
      </div>
      {children}
    </div>
  );
}

