import { GridType } from "client/scenes/SceneController";
import { Input } from "components/design";
import { Button } from "components/style";
import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Select } from "components/design/forms" ;

function GridTypeDropdown({ onChange }: any) {
  const options = [
    {label: "None", value: GridType.None},
    {label: "Square", value: GridType.Squares},
    {label: "Horizontal Hex", value: GridType.HorizontalHex},
    {label: "Vertical Hex", value: GridType.VerticalHex},
  ];
  return (
    <Select name="gridType" onChange={onChange} options={options} includeEmpty={false}/>
  );
}

export function GridSizeForm({ sceneController }: any): JSX.Element {
  const [ currentGridType, setCurrentGridType ] = React.useState(sceneController.getGridType());
  let gridForm: JSX.Element;
  // switch ()

  return (
    <div>
      <Button onClick={() => sceneController.setGridType(GridType.None)}>None</Button>
      <Button onClick={() => sceneController.setGridType(GridType.Squares)}>Squares</Button>
      <Button onClick={() => sceneController.setGridType(GridType.HorizontalHex)}>Horz. Hex</Button>
      <Button onClick={() => sceneController.setGridType(GridType.VerticalHex)}>Vert. Hex</Button>
      { sceneController.getGridTypeReadable() }
      <br/>
      { currentGridType }
      <Formik
        initialValues={{
          width: sceneController.scene.children[0].width,
          height: sceneController.scene.children[0].height,
          gridSize: sceneController.gridSize,
          gridType: currentGridType
        }}
        onSubmit={(values) => sceneController.setSceneSize(values, sceneController)}
      >
        { (props: any) => (
          <FormikForm>
            <GridTypeDropdown 
              onChange={(e: any) => {setCurrentGridType(e.currentTarget.value);props.handleChange(e); }}/>
            <Input type="number" name="width"/>
            <Input type="number" name="height"/>
            <Input type="number" name="gridSize"/>
            <Button type="submit">Save</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  )
}