/** The different kinds of elements that can be rendered by the Dynamic Render */
export enum NodeType {
  // FORM
  Checkbox = "Checkbox",
  NumberInput = "NumberInput",
  Radio = "Radio",
  TextArea = "TextArea",
  TextInput = "TextInput",

  // UI
  Box = "Box",
  Button = "Button",
  Column = "Column",
  Icon = "Icon",
  Label = "Label",
  Row = "Row",
  Table = "Table",
  TableCell = "TableCell",
  TableRow = "TableRow",
  Text = "#text",

  // Utility
  Collapse = "Collapse",
  Loop = "Loop",
  Page = "Page",
  PageGroup = "PageGroup",
  Prefab = "Prefab",
  Tabs = "Tabs",

  // Other
  Void = "Void",

  // DEPRECATED
  Background = "Background",
  Border = "Border",
  Inline = "Inline",
  Pageable = "Pageable",
}
