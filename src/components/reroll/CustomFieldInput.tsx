import { Button } from "@owl-factory/components/button";
import { Form, Formik, FormikProps } from "formik";
import React from "react";
import { string } from "yup";
import { v4 as uuid } from "uuid";
import { getUniques } from "@owl-factory/utilities/arrays";
import { Input } from "@owl-factory/components/form";

enum CustomFieldType {
  Text="text",
  Number="number", // Do we want one that allows decimals?
  Value="value",
  Multivalue="multi", // Allows for multiple value selections
  Multinumber="multinumber", // Allows for multiple value selections that are specifically numbers
}

interface CustomField {
  uuid: string; // A UUID for linking variables that may have had their key changed. The UUID will never change
  key: string; // The variable name
  complexKey: string; // A combination of the uuid and key to allow ordering and prevent overwrites
  label: string; // The user-readable label for this field. If the key is spell_level, this is Spell Level
  readabilityLabel?: string; // The aria label for this field. It defaults to the label, unless an alternative is given
  type: CustomFieldType; // What type of data is stored in this field
  isInherited?: boolean;
}

const INITIAL_VALUES = {
  key: "",
  label: "",
  readabilityLabel: "",
  type: "",
  values: [],
}

function onSubmit(values: any, allValues: any, setField: any, setSelected: any) {
  const complexKey = `${values.key}_${values.uuid}`;
  if (complexKey !== values.complexKey) {
    delete allValues[values.complexKey];
  }
  values.complexKey = complexKey;
  allValues[complexKey] = values;
  setField(allValues);
  setSelected(undefined);
}

/**
 * Renders the form to edit custom fields
 */
function FieldForm(props: any) {
  if (!props.selected) { return <></>; }
  const field = props.values[props.selected];

  return (
    <div style={{flexGrow: 1}}>
      <Formik
        initialValues={props.values[props.selected]}
        onSubmit={(values) => onSubmit(values, props.values, props.setField, props.setSelected)}
      >
        {(formikProps: FormikProps<any>) => {
          if (formikProps.values.complexKey !== props.selected) { formikProps.setValues(field); }
          return (
            <Form>
              <Input type="text" name="label" label="Label"/>
              <Input type="text" name="key" label="Key"/>

              <Button type="button" onClick={() => props.setSelected(undefined)}>Cancel</Button>
              <Button
                type="button"
                onClick={() => onSubmit(formikProps.values, props.values, props.setField, props.setSelected)}
              >
                Save
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

/**
 * Gets the next available untitled string
 * @param keys The list of names
 * @returns The first available untitled string
 */
function getNextUntitled(keys: string[]): string {
  let key = "untitled";
  for (let i = 1; i <= 100; i++) {
    if (!keys.includes(key)) { return key; }
    key = `untitled${i}`;
  }
  throw `No space for an untitled value value could be found. Please rename and try again`;
}

/**
 * 
 * @param values The previously existing custom field values
 * @returns The new key
 */
function generateKey(values: Record<string, CustomField>) {
  const complexKeys = Object.keys(values);
  const keys: string[] = [];
  for (const index of complexKeys) { keys.push(values[index].key); }

  const untitledKey = getNextUntitled(keys);
  return untitledKey;
}

function generateNewField(key: string): CustomField {
  const uniqueID = uuid();
  return {
    uuid: uniqueID,
    key: key,
    complexKey: `${key}_${uniqueID}`,
    label: key,
    type: CustomFieldType.Text,
  };
}

function FieldList(props: any) {
  const fields: JSX.Element[] = [];

  function addField() {
    const untitledKey = generateKey(props.values);

    const newField = generateNewField(untitledKey);
    const fullKey = `${newField.key}_${newField.uuid}`;
    props.values[fullKey] = newField;
    props.setField(props.values);
    props.setSelected(fullKey);
  }

  function removeField() {
    if (!props.selected) { return; }
    delete props.values[props.selected];
    props.setField(props.values);
    props.setSelected(undefined);
  }

  const keys = Object.keys(props.values).sort();
  for (const key of keys) {
    const field = props.values[key];
    const className = (key === props.selected) ? "active" : "";
    fields.push(
      <div key={field.uuid} className={className} onClick={() => props.setSelected(field.complexKey)}>
        {field.label} ({field.key})
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

interface CustomFieldInputProps {
  field: string;
  onChange: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  values: Record<string, unknown>;
}

export function CustomFieldInput(props: CustomFieldInputProps) {
  const [selected, setSelected] = React.useState<string | undefined>(undefined);

  const setField = (newValue: any) => props.onChange(props.field, newValue);
  const values = props.values[props.field];

  if (!values) { setField({}); }

  return (
    <div>
      <h2>Custom Fields</h2>
      <div style={{display: "flex"}}>
        <FieldList selected={selected} setSelected={setSelected} setField={setField} values={values}/>
        <FieldForm selected={selected} setSelected={setSelected} setField={setField} values={values}/>
      </div>
    </div>
  );
}
