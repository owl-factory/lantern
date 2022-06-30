export enum PageElementType {
  // Control element types with children
  Sheet, // Wraps the entire XML document
  Layout, // Indicates that the contents are what should be rendered by the engine
  Pageable, // Indicates that the contents can be paged between
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

  // Styling Elements without children
  Icon, // An Icon selected from a list of icons
  Label, // Applies a label to an input, or creates text
  Checkbox, // A checkbox input element
  Radio, // A simple radio input
  RadioButton, // A simple radio input styled as a button
  NumberInput, // An input specifically for adding numbers
  TextInput, // An input specifically for adding non-formatted text
  TextArea, // An input specifically for adding formatted text, eg markdown
  Select, // A select input

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
      return PageElementType.Sheet;
    case "pageable":
      return PageElementType.Pageable;
    case "page":
      return PageElementType.Page;
    case "prefabs":
      return PageElementType.Prefabs;
    case "newprefab":
      return PageElementType.NewPrefab;
    case "row":
      return PageElementType.Row;
    case "column":
      return PageElementType.Column;
    case "background":
      return PageElementType.Background;
    case "border":
      return PageElementType.Border;
    case "inline":
      return PageElementType.Inline;
    case "icon":
      return PageElementType.Icon;
    case "label":
      return PageElementType.Label;
    case "checkbox":
      return PageElementType.Checkbox;
    case "radio":
      return PageElementType.Radio;
    case "radiobutton":
      return PageElementType.RadioButton;
    case "numberinput":
      return PageElementType.NumberInput;
    case "textinput":
      return PageElementType.TextInput;
    case "textarea":
      return PageElementType.TextArea;
    case "select":
      return PageElementType.Select;
    case "loop":
      return PageElementType.Loop;
    case "prefab":
      return PageElementType.Prefab;

    default:
      return PageElementType.Unknown;
  }
}
