import { SceneModeReadable as SCENE_MODE_READABLE, SceneMode, GridType } from "client/scenes/SceneController";
import { Input } from "components/design";
import { Button } from "components/style";
import { Formik, Form as FormikForm } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import SceneBuilder from "./pages/SceneBuilder";

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
        <Button onClick={() => sceneController.setGridType(GridType.None)}>None</Button>
        <Button onClick={() => sceneController.setGridType(GridType.Squares)}>Squares</Button>
        <Button onClick={() => sceneController.setGridType(GridType.HorizontalHex)}>Horz. Hex</Button>
        <Button onClick={() => sceneController.setGridType(GridType.VerticalHex)}>Vert. Hex</Button>
        { sceneController.getGridTypeReadable() }
        <br/>

        <Formik
          initialValues={{
            width: sceneController.scene.children[0].width,
            height: sceneController.scene.children[0].height,
            gridSize: sceneController.gridSize,
          }}
          onSubmit={(values) => sceneController.setSceneSize(values, sceneController)}
        >
          <FormikForm>
            <Input type="number" name="width"/>
            <Input type="number" name="height"/>
            <Input type="number" name="gridSize"/>
            <Button type="submit">Save</Button>
          </FormikForm>
        </Formik>
      </div>
    </div>
  );
});
