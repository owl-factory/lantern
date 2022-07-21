export enum SheetElementType {
  // Control element types with children
  Sheet, // Wraps the entire XML document
  Layout, // Indicates that the contents are what should be rendered by the engine
  Pageable, // Indicates that the contents can be paged between
  Tabs, // An element that renders out the tabs for a given Pageable element
  Prefabs, // Declares that the contents are pre-made prefabs
  NewPrefab, // Declares that the contents are a prefab of a given name

  // Control Element types without children
  Prefab, // Renders pre-made formating from the NewPrefab type
  Unknown, // A case for a page element type where the tag name is unknown. We can render this as a red block

  // Styling Elements with Children
  Page, // Indicates that the contents are part of a single page that can be tabbed between
  Row, // Indicates that the contents should be organized in a column-like format inline
  Column, // Indicates that the contents exist within a certain width
  Background, // Places an image or svg behind the given children
  Border, // Places a border around the children
  Inline, // Indicates that the children should be rendered inline but without specific spacing
  Table, // Indicates that the children are part of a table
  TableRow, // Contains a single row of table cells
  TableCell, // A single cell within a table
  Select, // A select input
  Collapse, // A div that can collapse or open

  // Styling Elements without children
  Icon, // An Icon selected from a list of icons
  Label, // Applies a label to an input, or creates text
  Button, // A button that performs an action
  Checkbox, // A checkbox input element
  Radio, // A simple radio input
  NumberInput, // An input specifically for adding numbers
  TextInput, // An input specifically for adding non-formatted text
  TextArea, // An input specifically for adding formatted text, eg markdown
  Option, // A select input option

  // Functional Elements that perform tasks but do not directly appear
  Loop,
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
    case "sheet":
      return SheetElementType.Sheet;
    case "pageable":
      return SheetElementType.Pageable;
    case "tabs":
      return SheetElementType.Tabs;
    case "page":
      return SheetElementType.Page;
    case "prefabs":
      return SheetElementType.Prefabs;
    case "newprefab":
      return SheetElementType.NewPrefab;
    case "row":
      return SheetElementType.Row;
    case "column":
      return SheetElementType.Column;
    case "background":
      return SheetElementType.Background;
    case "border":
      return SheetElementType.Border;
    case "inline":
      return SheetElementType.Inline;
    case "icon":
      return SheetElementType.Icon;
    case "label":
      return SheetElementType.Label;
    case "button":
      return SheetElementType.Button;
    case "checkbox":
      return SheetElementType.Checkbox;
    case "radio":
    case "radiobutton":
      return SheetElementType.Radio;
    case "numberinput":
      return SheetElementType.NumberInput;
    case "table":
      return SheetElementType.Table;
    case "tablecell":
      return SheetElementType.TableCell;
    case "tablerow":
      return SheetElementType.TableRow;
    case "collapse":
      return SheetElementType.Collapse;
    case "textinput":
      return SheetElementType.TextInput;
    case "textarea":
      return SheetElementType.TextArea;
    case "select":
      return SheetElementType.Select;
    case "option":
      return SheetElementType.Option;
    case "loop":
      return SheetElementType.Loop;
    case "prefab":
      return SheetElementType.Prefab;

    default:
      return SheetElementType.Unknown;
  }
}
