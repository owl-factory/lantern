export enum ElementType {
  // Input - Elements that are for editing the values of the Render subject
  Checkbox=0, // A checkbox input element
  NumberInput, // An input specifically for adding numbers
  Option, // A select input option
  Radio, // A simple radio input
  Select, // A select input
  TextInput, // An input specifically for adding non-formatted text
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
 * @param tagName The name of the element tag (eg Page, Row, or Column)
 * @returns The appropriate PageElementType
 */
export function elementNameToPageElementType(tagName: string) {
  switch(tagName.toLocaleLowerCase()) {
    // Inputs
    case "checkbox":
      return ElementType.Checkbox;
    case "numberinput":
      return ElementType.NumberInput;
    case "option":
      return ElementType.Option;
    case "radio":
    case "radiobutton":
      return ElementType.Radio;
    case "select":
      return ElementType.Select;
    case "textinput":
      return ElementType.TextInput;
    case "textarea":
      return ElementType.TextArea;

    // Layout
    case "box":
      return ElementType.Box;
    case "column":
      return ElementType.Column;
    case "icon":
      return ElementType.Icon;
    case "inline":
      return ElementType.Inline;
    case "label":
      return ElementType.Label;
    case "row":
      return ElementType.Row;
    case "table":
      return ElementType.Table;
    case "tablecell":
      return ElementType.TableCell;
    case "tablerow":
      return ElementType.TableRow;

    // Required
    case "allfields":
      return ElementType.AllFields;
    case "profileeditor":
      return ElementType.ProfileEditor;
    case "tokeneditor":
      return ElementType.TokenEditor;

    // Utility
    case "button":
      return ElementType.Button;
    case "collapse":
      return ElementType.Collapse;
    case "loop":
      return ElementType.Loop;
    case "newprefab":
      return ElementType.NewPrefab;
    case "page":
      return ElementType.Page;
    case "pageable":
      return ElementType.Pageable;
    case "prefab":
      return ElementType.Prefab;
    case "prefabs":
      return ElementType.Prefabs;
    case "sheet":
      return ElementType.Sheet;
    case "tabs":
      return ElementType.Tabs;

    default:
      return ElementType.Unknown;
  }
}
