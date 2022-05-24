
import { Button } from "@owl-factory/components/button";
import React from "react";
import { CustomField } from "types/documents/subdocument/CustomField";
import { generateCustomFieldKey, generateNewCustomField } from "utilities/customField/helpers";
import styles from "./CustomFieldList.module.scss";

interface FieldListProps {
  selected: string | undefined; // The currently active custom field
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  fields: Record<string, Partial<CustomField> | null>;
  setField: React.Dispatch<React.SetStateAction<Record<string, Partial<CustomField> | null>>>;
}

/**
 * Renders a selectable list of custom fields for the current object
 * @param selected The UUID of the currently active custom field
 * @param setSelected The function to set the currently active custom field
 * @param fields The object containing custom fields
 * @param setField The function to set the field data when creating a new custom field
 */
export function FieldList(props: FieldListProps) {
  const fields: JSX.Element[] = [];

  /**
   * Adds a new field to the custom input field
   */
  function addField() {
    const untitledKey = generateCustomFieldKey(props.fields);
    const newField = generateNewCustomField(untitledKey);
    props.fields[newField.uuid] = newField;
    props.setField(props.fields);
    props.setSelected(newField.uuid);
  }

  /**
   * Removes the currently active custom field
   */
  function removeField() {
    if (!props.selected) { return; }
    props.fields[props.selected] = null;

    props.setField(props.fields);
    props.setSelected(undefined);
  }

  function setSelected(uuid: string | undefined) {
    if (uuid === props.selected) { props.setSelected(undefined); }
    else { props.setSelected(uuid); }
  }

  // Generates the rows for each of the items
  // TODO - give this its own function?
  // Tertiary operator is to prevent pre-load from throwing an error
  const uuids = props.fields ? Object.keys(props.fields) : [];
  const uuidLabelMap: Record<string, string> = {};
  for (const uuid of uuids) {
    const field = props.fields[uuid];
    if (!field || !field.name) { continue; }
    uuidLabelMap[field.name] = uuid;
  }

  const labels = Object.keys(uuidLabelMap).sort();
  for (const label of labels) {

    const field = props.fields[uuidLabelMap[label]];
    if (!field) { continue; }

    const className = (field.uuid === props.selected) ? styles.active : "";
    fields.push(
      <div key={field.uuid} className={className} onClick={() => setSelected(field.uuid)}>
        {field.name} ({field.key})
      </div>
    );
  }

  return (
    <div style={{borderStyle: "dashed", borderWidth: 1, flexGrow: 1}}>
      <div>
        <Button onClick={removeField}>-</Button>
        <Button onClick={addField}>+</Button>
      </div>
      <div>
        {fields}
      </div>
    </div>
  );
}
