import { SceneModeReadable as SCENE_MODE_READABLE, SceneMode } from "types/enums/scene";
import { Button } from "components/style";
import { Drawer, DrawerItem } from "components/style/drawer/Drawer";
import { observer } from "mobx-react-lite";
import React from "react";
import { MdGridOn, MdImage, MdSupervisorAccount } from "react-icons/md";
import { ImageDocument } from "types/documents";
import { ImageList, ListFormat } from "../library";
import { GridForm } from "./forms/grid";
import { SceneSettings } from "./SceneSettings";

/**
 * Renders a wrapper that surrounds a scene, applying UI for interaction with the Scene
 */
export const SceneBuilderOverlay = observer(({ children, imageController, sceneController }: any): JSX.Element => {
  function addSprite() {
    sceneController.getPropManager().addProp(
      { src: "/dev/images/sprites/waals_brodnen_death_sprite.png" },
      125,
      125
    );
  }

  return (
    <div>
      <Drawer >
        <DrawerItem name="Scene Settings" Icon={MdGridOn}><SceneSettings controller={sceneController}/></DrawerItem>
        <DrawerItem name="Images" Icon={MdImage}>
          <ImageList
            imageController={imageController}
            listFormat={ListFormat.Icons}
            onClick={(image: ImageDocument) => sceneController.getPropManager().addProp(image)}
          />
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
      <div>
        <Button onClick={sceneController.getSaveLoader().save}>Save</Button>
      </div>
    </div>
  );
});
