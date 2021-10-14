import { SceneModeReadable as SCENE_MODE_READABLE, SceneMode } from "controllers/scenes/SceneController";
import { Button } from "components/style";
import { Drawer, DrawerItem } from "components/style/drawer/Drawer";
import { observer } from "mobx-react-lite";
import React from "react";
import { MdGridOn, MdImage, MdSupervisorAccount } from "react-icons/md";
import { ImageDocument } from "types/documents";
import { ImageList, ListFormat } from "../library";
import { GridForm } from "./forms/grid";

/**
 * Renders a wrapper that surrounds a scene, applying UI for interaction with the Scene
 */
export const SceneBuilderOverlay = observer(({ children, sceneController }: any): JSX.Element => {
  function addSprite() {
    sceneController.createSprite(
      "http://192.168.0.195:3000/dev/images/sprites/waals_brodnen_death_sprite.png",
      125,
      125
    );
  }

  return (
    <div>
      <Drawer >
        <DrawerItem name="Grid Sizing" Icon={MdGridOn}><GridForm sceneController={sceneController}/></DrawerItem>
        <DrawerItem name="Images" Icon={MdImage}>
          <ImageList
          listFormat={ListFormat.Icons}
          onClick={(image: ImageDocument) => sceneController.addProp(sceneController, image)}/>
        </DrawerItem>
        <DrawerItem name="Characters" Icon={MdSupervisorAccount}>
          Nothing yet
        </DrawerItem>
      </Drawer>
      <div>
        <Button onClick={() => sceneController.setMode(SceneMode.Select) }>Select</Button>
        <Button onClick={() => sceneController.setMode(SceneMode.Pan) }>Pan</Button>
        <br/>
        Current mode: {SCENE_MODE_READABLE[sceneController.mode]}
      </div>
      <div>
        <Button className="sm" onClick={addSprite}>Add Image</Button>
      </div>
      {children}
    </div>
  );
});
