// Tracks the different types of possible elements that the system will support in custom XML rendering
export enum ElementType {
  // Input - Elements that are for editing the values of the Render subject
  Checkbox=0, // A checkbox input element
  Input, // An input for setting limited text or number values
  Option, // A select input option
  Radio, // A simple radio input
  Select, // A select input
  TextArea, // An input specifically for adding formatted text, eg markdown

  // Layout - Elements that have low amounts of processing and usually directly translate to HTML elements with CSS
  Box=100, // A generic div element that may be one of several types
  Column, // Indicates that the contents exist within a certain width
  Icon, // An Icon selected from a list of icons
  Inline, // Indicates that the children should be rendered inline but without specific spacing
  Label, // Applies a label to an input, or creates text
  Row, // Indicates that the contents should be organized in a column-like format inline
  Table, // Indicates that the children are part of a table
  TableRow, // Contains a single row of table cells
  TableCell, // A single cell within a table

  // Required - Elements that are required and have a special, non-replicable purpose
  AllFields=200, // Renders a list of all fields used within the
  ProfileEditor,
  TokenEditor,

  // Utility - Elements that have a large amount of processing
  Button=300, // A button that performs an action
  Collapse, // A div that can collapse or open
  Loop, // Repeats the children n times for a given list
  NewPrefab, // Declares that the contents are a prefab of a given name
  Page, // Indicates that the contents are part of a single page that can be tabbed between
  Pageable, // Indicates that the contents can be paged between
  Prefab, // Renders pre-made formating from the NewPrefab type
  Tabs, // An element that renders out the tabs for a given Pageable element

  // System - System control elements that are used for the rendering engine and do not have an associated render
  Layout=400, // Indicates that the contents are what should be rendered by the engine
  Prefabs, // Declares that the contents are pre-made prefabs
  Sheet, // Wraps the entire XML document


  // Non-functional components. This indicates an error somewhere in the parsing
  Error=500, // Indicates that an error has occured in the rendering somewhere and was caught
  Unknown, // A case for a page element type where the tag name is unknown. We can render this as a red block
}

/**
 * Converts a raw string element tag name into the appropriate PageElementType
 * A function is used for reverse-compatibility, such as if a tag is renamed (TextAreaInput -> TextArea)
 * and we want to keep old versions functioning
 * @todo Remove the non-layout elements, like Sheet or Layout
 * @param tagName The name of the element tag (eg Page, Row, or Column)
 * @returns The appropriate PageElementType
 */
 export function elementNameToPageElementType(tagName: string) {
  switch(tagName) {
    // Inputs
    case "Checkbox":
      return ElementType.Checkbox;
    case "Input":
      return ElementType.Input;
    case "Option":
      return ElementType.Option;
    case "Radio":
      return ElementType.Radio;
    case "Select":
      return ElementType.Select;
    case "TextArea":
      return ElementType.TextArea;

    // Layout
    case "Box":
      return ElementType.Box;
    case "Column":
      return ElementType.Column;
    case "Icon":
      return ElementType.Icon;
    case "Inline":
      return ElementType.Inline;
    case "Label":
      return ElementType.Label;
    case "Row":
      return ElementType.Row;
    case "Table":
      return ElementType.Table;
    case "TableCell":
      return ElementType.TableCell;
    case "TableRow":
      return ElementType.TableRow;

    // Required
    case "AllFields":
      return ElementType.AllFields;
    case "ProfileEditor":
      return ElementType.ProfileEditor;
    case "TokenEditor":
      return ElementType.TokenEditor;

    // Utility
    case "Button":
      return ElementType.Button;
    case "Collapse":
      return ElementType.Collapse;
    case "Loop":
      return ElementType.Loop;
    case "NewPrefab":
      return ElementType.NewPrefab;
    case "Page":
      return ElementType.Page;
    case "Pageable":
      return ElementType.Pageable;
    case "Prefab":
      return ElementType.Prefab;
    case "Prefabs":
      return ElementType.Prefabs;
    case "Sheet":
      return ElementType.Sheet;
    case "Tabs":
      return ElementType.Tabs;

    default:
      return ElementType.Unknown;
  }
}
