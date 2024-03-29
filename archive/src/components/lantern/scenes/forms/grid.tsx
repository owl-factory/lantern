import { GridType } from "controllers/maps/SceneController";
import { Button } from "@chakra-ui/react";
import { Formik, Form as FormikForm, FormikProps } from "formik";
import React from "react";
import { Input } from "components/form";
import { Select } from "components/form/Select";
import { MapController } from "controllers/maps/map";
import { GridController } from "controllers/maps/grid";
import { observer } from "mobx-react-lite";

// TODO - break this file up into a node!

// The default width of the grid count inputs
const DEFAULT_GRID_INPUT_WIDTH="4.5em";
// The default width of the pixel input
const DEFAULT_PIXEL_INPUT_WIDTH="7em";

// The different options for selecting between the different grid types
const GRID_TYPE_OPTIONS = [
  {label: "None", value: GridType.None},
  {label: "Square", value: GridType.Squares},
  {label: "Horizontal Hex", value: GridType.HorizontalHex},
  {label: "Vertical Hex", value: GridType.VerticalHex},
];

// The different grid sizing options
const GRID_SIZE_OPTIONS = [
  { label: "Normal (32px)", value: 32 },
  { label: "Double (64px)", value: 64 },
  { label: "Fantasy Grounds (50px)", value: 50 },
  { label: "Roll20 (70px)", value: 70 },
  { label: "Custom", value: "custom" },
];

// TODO - move elsewhere?
export interface GridFormValues {
  height: number;
  width: number;
  expectedHeight: number;
  expectedWidth: number;
  gridHeight: number;
  gridWidth: number;
  gridSize: number;
  gridSizeSelect: string;
  gridType: GridType;
}

type FormikGridProps = FormikProps<GridFormValues>;
type onChangeEvent = React.ChangeEvent<any>;

/**
 * Updates the grid height and the expected height for the number of grids
 * @param formikProps The formik props containing values and update functions
 * @param pixelHeight The height of the scene in pixels
 * @param gridSize The size a grid
 * @param gridType The type of grid
 */
function updateGridHeight(formikProps: FormikGridProps, pixelHeight: number, gridSize: number, gridType: GridType) {
  const height = GridController.calculateGridCount(pixelHeight, gridSize, gridType, "vertical");
  const expectedHeight = GridController.calculateGridToPixels(gridSize, height, gridType, "vertical");
  formikProps.setFieldValue("gridHeight", height);
  formikProps.setFieldValue("expectedHeight", expectedHeight);
}

/**
 * Updates the grid width and the expected width for the number of grids
 * @param formikProps The formik props containing values and update functions
 * @param pixelHeight The height of the scene in pixels
 * @param gridSize The size a grid
 * @param gridType The type of grid
 */
function updateGridWidth(formikProps: FormikGridProps, pixelWidth: number, gridSize: number, gridType: GridType) {
  const width = GridController.calculateGridCount(pixelWidth, gridSize, gridType, "horizontal");
  const expectedWidth = GridController.calculateGridToPixels(gridSize, width, gridType, "horizontal");
  formikProps.setFieldValue("gridWidth", width);
  formikProps.setFieldValue("expectedWidth", expectedWidth);
}

/**
 * Handles updating dependencies when the grid type changes
 * @param e The onChange event
 * @param formikProps The formik props containing values and update functions
 */
function onGridTypeChange(e: onChangeEvent, formikProps: FormikGridProps) {
  updateGridWidth(formikProps, formikProps.values.width, formikProps.values.gridSize, e.currentTarget.value);
  updateGridHeight(formikProps, formikProps.values.height, formikProps.values.gridSize, e.currentTarget.value);

  formikProps.handleChange(e);
}

/**
 * Handles updating dependencies when the grid size changes
 * @param e The onChange event
 * @param formikProps The formik props containing values and update functions
 */
function onGridSizeChange(e: onChangeEvent, formikProps: FormikGridProps) {
  updateGridWidth(formikProps, formikProps.values.width, e.currentTarget.value, formikProps.values.gridType);
  updateGridHeight(formikProps, formikProps.values.height, e.currentTarget.value, formikProps.values.gridType);

  formikProps.handleChange(e);
}

/**
 * Handles updating dependencies when the grid size select changes
 * @param e The onChange event
 * @param formikProps The formik props containing values and update functions
 */
function onGridSizeSelectChange(e: onChangeEvent, formikProps: FormikGridProps) {
  if (e.currentTarget.value !== "custom") {
    // TODO - needs onGridSizeChange?
    onGridSizeChange(e, formikProps);
    formikProps.setFieldValue("gridSize", parseInt(e.currentTarget.value));
  }
  formikProps.handleChange(e);
}

/**
 * Handles updating dependencies when the scene height changes
 * @param e The onChange event
 * @param formikProps The formik props containing values and update functions
 */
function onHeightChange(e: onChangeEvent, formikProps: FormikGridProps) {
  updateGridHeight(formikProps, e.currentTarget.value, formikProps.values.gridSize, formikProps.values.gridType);
  formikProps.handleChange(e);
}

/**
 * Handles updating dependencies when the scene width changes
 * @param e The onChange event
 * @param formikProps The formik props containing values and update functions
 */
function onWidthChange(e: onChangeEvent, formikProps: FormikGridProps) {
  updateGridWidth(formikProps, e.currentTarget.value, formikProps.values.gridSize, formikProps.values.gridType);
  formikProps.handleChange(e);
}

/**
 * Handles updating dependencies when the grid height changes
 * @param e The onChange event
 * @param formikProps The formik props containing values and update functions
 */
function onHeightGridChange(e: onChangeEvent, formikProps: FormikGridProps) {
  const expectedHeight = GridController.calculateGridToPixels(
    formikProps.values.gridSize,
    e.currentTarget.value,
    formikProps.values.gridType,
    "vertical"
  );
  formikProps.setFieldValue("expectedHeight", expectedHeight);
  formikProps.setFieldValue("height", expectedHeight);
  formikProps.handleChange(e);
}

/**
 * Handles updating dependencies when the grid width changes
 * @param e The onChange event
 * @param formikProps The formik props containing values and update functions
 */
function onWidthGridChange(e: onChangeEvent, formikProps: FormikGridProps) {
  const expectedWidth = GridController.calculateGridToPixels(
    formikProps.values.gridSize,
    e.currentTarget.value,
    formikProps.values.gridType,
    "horizontal"
  );
  formikProps.setFieldValue("expectedWidth", expectedWidth);
  formikProps.setFieldValue("width", expectedWidth);
  formikProps.handleChange(e);
}

/**
 * Sets the actual scene height with the expected height
 * @param formikProps The formik props containing values and update functions
 */
function setActualHeight(formikProps: FormikGridProps) {
  formikProps.setFieldValue("height", formikProps.values.expectedHeight);
}

/**
 * Sets the actual scene width with the expected width
 * @param formikProps The formik props containing values and update functions
 */
function setActualWidth(formikProps: FormikGridProps) {
  formikProps.setFieldValue("width", formikProps.values.expectedWidth);
}

interface GridSubformProps {
  formikProps: FormikGridProps;
}

/**
 * Renders the select and options for the Grid Type
 * @param onChange The event handler to run on change
 */
function GridTypeDropdown({ formikProps }: GridSubformProps) {
  const options: JSX.Element[] = [];
  GRID_TYPE_OPTIONS.forEach((option) => {
    options.push(<option key={option.value} value={option.value}>{option.label}</option>);
  });
  return (
    <span>
      Grid Type:&nbsp;
      <Select
        name="gridType"
        onChange={(e: onChangeEvent) => {onGridTypeChange(e, formikProps);}}
        style={{ display: "inline", width: "10em" }}
      >
        {options}
      </Select>
    </span>
  );
}

/**
 * Renders the input for changing the grid size. Renders the default selection options and a custom
 * input for alternate grid sizes
 * @param onChange The event handler for the grid size selection's change
 * @param values The values of the form
 */
function GridSize({ formikProps }: GridSubformProps): JSX.Element {
  const options: JSX.Element[] = [];
  GRID_SIZE_OPTIONS.forEach((option) => {
    options.push(<option key={option.value} value={option.value}>{option.label}</option>);
  });
  return (
    <div>
      Grid Size:&nbsp;
      <Select
        name="gridSizeSelect"
        onChange={(e: onChangeEvent) => onGridSizeSelectChange(e, formikProps)}
        style={{ display: "inline", width: "13em" }}
      >
        {options}
      </Select>
      { (formikProps.values.gridSizeSelect === "custom") ?
        <>
          <Input
            name="gridSize"
            type="number"
            onChange={(e: onChangeEvent) => onGridSizeChange(e, formikProps)}
            style={{display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH}}
          />px</> : null
      }
    </div>
  );
}

/**
 * Renders the grid height input
 * @param formikProps The formik props containing values and update functions
 */
function HeightGridInput({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <span>
      <Input
        type="number"
        name="gridHeight"
        onChange={(e: onChangeEvent) => onHeightGridChange(e, formikProps)}
        style={{ display: "inline", width: DEFAULT_GRID_INPUT_WIDTH}}
      />
    </span>
  );
}

/**
 * Renders the grid width input
 * @param formikProps The formik props containing values and update functions
 */
function WidthGridInput({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <span>
      <Input
      type="number"
      name="gridWidth"
      onChange={(e: onChangeEvent) => onWidthGridChange(e, formikProps)}
      style={{ display: "inline", width: DEFAULT_GRID_INPUT_WIDTH}}/>
    </span>
  );
}

/**
 * Renders the scene height input
 * @param formikProps The formik props containing values and update functions
 */
function HeightPixelsInput({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <span>
       {( formikProps.values.height !== formikProps.values.expectedHeight) ?
        <span>
          <Input
            type="text"
            name="expectedHeight"
            disabled={true}
            style={{ display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH }}
          />
          <Button type="button" onClick={() => setActualHeight(formikProps)}>=&gt;</Button>
        </span> : null
      }
      <Input
        type="number"
        name="height"
        onChange={(e: onChangeEvent) => onHeightChange(e, formikProps)}
        style={{display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH}}
      />px
    </span>
  );
}

/**
 * Renders the scene height input
 * @param formikProps The formik props containing values and update functions
 */
function WidthPixelsInput({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <span>
      {( formikProps.values.width !== formikProps.values.expectedWidth) ?
        <span>
          <Input
            type="text"
            name="expectedWidth"
            disabled={true}
            style={{ display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH }}
          />
          <Button type="button" onClick={() => setActualWidth(formikProps)}>=&gt;</Button>
        </span> : null
      }
      <Input
        type="number"
        name="width"
        onChange={(e: onChangeEvent) => onWidthChange(e, formikProps)}
        style={{display: "inline", width: DEFAULT_PIXEL_INPUT_WIDTH}}
      />px
    </span>
  );
}

/**
 * Renders one of the four grid forms
 * @param formikProps The formik props containing values and update functions
 */
function GridTypeForm({ formikProps }: GridSubformProps) {
  switch(parseInt(formikProps.values.gridType as unknown as string)) {
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

/**
 * Renders the form for the None grid type
 * @param formikProps The formik props containing values and update functions
 */
function NoGridForm({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <div>
      Width: <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

/**
 * Renders the form for the squares grid type
 * @param formikProps The formik props containing values and update functions
 */
function SquareGridForm({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <div>
      Width: <WidthGridInput formikProps={formikProps}/>
      squares &times; { formikProps.values.gridSize }px = <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightGridInput formikProps={formikProps}/>
      squares &times; { formikProps.values.gridSize}px = <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

/**
 * Renders the form for the horizontal hexagon grid type
 * @param formikProps The formik props containing values and update functions
 */
function HorizontalHexGridForm({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <div>
      Width: <WidthGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize }px = <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize}px = <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

/**
 * Renders the form for the vertical hexagon grid type
 * @param formikProps The formik props containing values and update functions
 */
function VerticalHexGridForm({ formikProps }: GridSubformProps): JSX.Element {
  return (
    <div>
      Width: <WidthGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize }px &times; 0.866 = <WidthPixelsInput formikProps={formikProps}/><br/>
      Height: <HeightGridInput formikProps={formikProps}/>
      hexes &times; { formikProps.values.gridSize}px = <HeightPixelsInput formikProps={formikProps}/>
    </div>
  );
}

/**
 * Renders a form for setting and selecting the grid type of the current scene
 * @param formikProps The formik props containing values and update functions
 */
export const GridForm = observer((): JSX.Element => {
  return (
    <div>
      <Formik
        initialValues={{
          width: MapController.width,
          height: MapController.height,
          expectedWidth: MapController.width,
          expectedHeight: MapController.height,
          gridWidth: GridController.calculateGridCount(
            MapController.width,
            GridController.size,
            GridController.type,
            "horizontal"
          ),
          gridHeight: GridController.calculateGridCount(
            MapController.height,
            GridController.size,
            GridController.type,
            "vertical"
          ),
          gridSize: GridController.size,
          gridSizeSelect: GridController.size.toString(),
          gridType: GridController.type,
        }}
        onSubmit={(values: GridFormValues) => MapController.setMap(values)}
      >
        { (props: any) => (
          <FormikForm>
            <GridTypeDropdown formikProps={props}/>
            <GridSize formikProps={props}/>
            <GridTypeForm formikProps={props}/>
            <Button type="button" disabled={!props.dirty}>Reset</Button>
            <Button type="submit" disabled={!props.dirty}>Update</Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
});
