import { GridType } from "client/scenes/SceneController";
import { Input } from "components/design";
import { Button } from "components/style";
import { Formik, Form as FormikForm } from "formik";
import React from "react";
import { Select } from "components/design/forms" ;

const DEFAULT_GRID_INPUT_WIDTH="4.5em";
const DEFAULT_PIXEL_INPUT_WIDTH="7em";
const GRID_TYPE_OPTIONS = [
  {label: "None", value: GridType.None},
  {label: "Square", value: GridType.Squares},
  {label: "Horizontal Hex", value: GridType.HorizontalHex},
  {label: "Vertical Hex", value: GridType.VerticalHex},
];

const GRID_SIZE_OPTIONS = [
  { label: "Normal (32px)", value: 32 },
  { label: "Double (64px)", value: 64 },
  { label: "Fantasy Grounds (50px)", value: 50 },
  { label: "Roll20 (70px)", value: 70 },
  { label: "Custom", value: "custom" },
];

/**
 * Calculates the number of grids in a given direction for the given dimensions.
 * Returns the number of grids, rounded up to the nearest whole number
 * @param pixelSize The size in pixels of the scene
 * @param gridSize The size of the grid tile
 * @param gridType The type of grid
 * @param direction The direction, either "horizontal" or "vertical"
 */
function calculateGridCount(
  pixelSize: number,
  gridSize: number,
  gridType: GridType,
  direction: "horizontal" | "vertical"
): number {
  gridType = parseInt(gridType as unknown as string);
  if ((gridType) === GridType.None) {
    return pixelSize;
  }

  if ((gridType) === GridType.Squares) {
    return Math.ceil(pixelSize / gridSize);
  }

  if (
    (gridType === GridType.VerticalHex && direction === "vertical") ||
    (gridType === GridType.HorizontalHex && direction === "horizontal")
  ) {
    return Math.ceil(((pixelSize * 0.866) / (gridSize * 0.75)) - 0.25);
  } else {
    return Math.ceil(pixelSize / (gridSize));
  }
}

function updateGridHeight(formikProps: any, pixelHeight: number, gridSize: number, gridType: GridType) {
  const height = calculateGridCount(pixelHeight, gridSize, gridType, "vertical");
  formikProps.setFieldValue("gridHeight", height);
  formikProps.setFieldValue("expectedHeight", height * gridSize);
}

function updateGridWidth(formikProps: any, pixelWidth: number, gridSize: number, gridType: GridType) {
  const width = calculateGridCount(pixelWidth, gridSize, gridType, "horizontal");
  formikProps.setFieldValue("gridWidth", width);
  formikProps.setFieldValue("expectedWidth", width * gridSize);
}

function onGridTypeChange(e: any, formikProps: any) {
  updateGridWidth(formikProps, formikProps.values.width, formikProps.values.gridSize, e.currentTarget.value);
  updateGridHeight(formikProps, formikProps.values.height, formikProps.values.gridSize, e.currentTarget.value);

  formikProps.handleChange(e);
}

function onGridSizeChange(e: any, formikProps: any) {
  updateGridWidth(formikProps, formikProps.values.width, e.currentTarget.value, formikProps.values.gridType);
  updateGridHeight(formikProps, formikProps.values.width, e.currentTarget.value, formikProps.values.gridType);

  formikProps.handleChange(e);
}

function onGridSizeSelectChange(e: any, formikProps: any) {
  if (e.currentTarget.value !== "custom") {
    // TODO - needs onGridSizeChange?
    onGridSizeChange(e, formikProps);
    formikProps.setFieldValue("gridSize", parseInt(e.currentTarget.value));
  }
  formikProps.handleChange(e);
}

function onHeightChange(e: any, formikProps: any) {
  updateGridHeight(formikProps, e.currentTarget.value, formikProps.values.gridSize, formikProps.values.gridType);
  formikProps.handleChange(e);
}

function onWidthChange(e: any, formikProps: any) {
  updateGridWidth(formikProps, e.currentTarget.value, formikProps.values.gridSize, formikProps.values.gridType);
  formikProps.handleChange(e);
}

function onHeightGridChange(e: any, formikProps: any) {
  formikProps.setFieldValue("expectedHeight", e.currentTarget.value * formikProps.values.gridSize);
  formikProps.setFieldValue("height", e.currentTarget.value * formikProps.values.gridSize);
  formikProps.handleChange(e);
}

function onWidthGridChange(e: any, formikProps: any) {
  formikProps.setFieldValue("expectedWidth", e.currentTarget.value * formikProps.values.gridSize);
  formikProps.setFieldValue("width", e.currentTarget.value * formikProps.values.gridSize);
  formikProps.handleChange(e);
}

function setActualHeight(formikProps: any) {
  formikProps.setFieldValue("height", formikProps.values.expectedHeight);
}

function setActualWidth(formikProps: any) {
  formikProps.setFieldValue("width", formikProps.values.expectedWidth);
}

/**
 * Renders the select and options for the Grid Type
 * @param onChange The event handler to run on change
 */
function GridTypeDropdown({ formikProps }: any) {
  return (
    <span>
      Grid Type:&nbsp;
      <Select
        name="gridType"
        onChange={(e: any) => {onGridTypeChange(e, formikProps);}}
        options={GRID_TYPE_OPTIONS}
        includeEmpty={false}
        style={{ display: "inline", width: "10em" }}
      />
    </span>
  );
}

/**
 * Renders the input for changing the grid size. Renders the default selection options and a custom
 * input for alternate grid sizes
 * @param onChange The event handler for the grid size selection's change
 * @param values The values of the form
 */
function GridSize({ formikProps, values }: any): JSX.Element {
  return (
    <div>
      Grid Size:&nbsp;
      <Select
        name="gridSizeSelect"
        options={GRID_SIZE_OPTIONS}
        includeEmpty={false}
        onChange={(e: any) => onGridSizeSelectChange(e, formikProps)}
        style={{ display: "inline", width: "13em" }}
      />
      { (values.gridSizeSelect === "custom") ?
        <>
          <Input
            name="gridSize"
            type="number"
            onChange={(e: any) => onGridSizeChange(e, formikProps)}
            style={{display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH}}
          />px</> : null
      }
    </div>
  );
}

function HeightGridInput({ formikProps }: any): JSX.Element {
  return (
    <span>
      <Input
        type="number"
        name="gridHeight"
        onChange={(e: any) => onHeightGridChange(e, formikProps)}
        style={{ display: "inline", width: DEFAULT_GRID_INPUT_WIDTH}}
      />
    </span>
  );
}

function WidthGridInput({ formikProps }: any): JSX.Element {
  return (
    <span>
      <Input
      type="number"
      name="gridWidth"
      onChange={(e: any) => onWidthGridChange(e, formikProps)}
      style={{ display: "inline", width: DEFAULT_GRID_INPUT_WIDTH}}/>
    </span>
  );
}


function HeightPixelsInput({ formikProps }: any): JSX.Element {
  return (
    <span>
       {( formikProps.values.width !== formikProps.values.expectedWidth) ?
        <span>
          <Input name="expectedWidth" disabled={true} style={{ display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH }}/>
          <Button type="button" onClick={() => setActualHeight(formikProps)}>=&gt;</Button>
        </span> : null
      }
      <Input
        type="number"
        name="height"
        onChange={(e: any) => onHeightChange(e, formikProps)}
        style={{display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH}}
      />px
    </span>
  );
}

function WidthPixelsInput({ formikProps }: any): JSX.Element {
  return (
    <span>
      {( formikProps.values.width !== formikProps.values.expectedWidth) ?
        <span>
          <Input name="expectedWidth" disabled={true} style={{ display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH }}/>
          <Button type="button" onClick={() => setActualWidth(formikProps)}>=&gt;</Button>
        </span> : null
      }
      <Input
        type="number"
        name="width"
        onChange={(e: any) => onWidthChange(e, formikProps)}
        style={{display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH}}
      />px
    </span>
  );
}


function GridForm({ formikProps, values }: any) {
  switch(parseInt(formikProps.values.gridType)) {
    case GridType.None:
      return <NoGridForm formikProps={formikProps}/>;
    case GridType.Squares:
      return <SquareGridForm formikProps={formikProps}/>;
    case GridType.HorizontalHex:
        return <HorizontalHexGridForm formikProps={formikProps}/>;
    case GridType.VerticalHex:
        return <VerticalHexGridForm formikProps={formikProps}/>;
    default:
      return <></>;
  }
}

function NoGridForm({ formikProps }: any): JSX.Element {
  return (
    <div>
      Width: <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

function SquareGridForm({ formikProps }: any): JSX.Element {
  return (
    <div>
      Width: <WidthGridInput formikProps={formikProps}/>
      squares &times; { formikProps.values.gridSize }px = <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightGridInput formikProps={formikProps}/>
      squares &times; { formikProps.values.gridSize}px = <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

function HorizontalHexGridForm({ formikProps }: any): JSX.Element {
  return (
    <div>
      Width: <WidthGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize }px = <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize}px &times; 0.866 = <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

function VerticalHexGridForm({ formikProps }: any): JSX.Element {
  return (
    <div>
      Width: <WidthGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize }px &times; 0.866 = <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize}px = <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

export function GridSizeForm({ sceneController }: any): JSX.Element {
  return (
    <div>
      <Formik
        initialValues={{
          width: sceneController.scene.children[0].width,
          height: sceneController.scene.children[0].height,
          gridWidth: calculateGridCount(
            sceneController.scene.children[0].width,
            sceneController.gridSize,
            sceneController.getGridType(),
            "horizontal"
          ),
          gridHeight: calculateGridCount(
            sceneController.scene.children[0].height,
            sceneController.gridSize,
            sceneController.getGridType(),
            "vertical"
          ),
          gridSize: sceneController.gridSize,
          gridSizeSelect: sceneController.gridSize,
          gridType: sceneController.getGridType(),
        }}
        onSubmit={(values) => sceneController.setSceneSize(values, sceneController)}
      >
        { (props: any) => (
          <FormikForm>
            <GridTypeDropdown formikProps={props}/>
            <GridSize
              formikProps={props}
              values={props.values}
            />
            <GridForm formikProps={props} values={props.values}/>
            <Button type="button" disabled={!props.dirty}>Reset</Button>
            <Button type="submit" disabled={!props.dirty}>Update</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}
