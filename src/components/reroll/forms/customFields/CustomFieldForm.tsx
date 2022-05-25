
import { Button } from "@owl-factory/components/button";
import { Input, Select } from "@owl-factory/components/form";
import { Formik, FormikProps } from "formik";
import { makeAutoObservable, makeObservable, observable } from "mobx";
import React from "react";
import { CustomField } from "types/documents/subdocument/CustomField";
import { ReadableCustomFieldType } from "types/enums/subdocument/CustomFieldType";
import { CustomFieldValuesForm } from "./CustomFieldValuesForm";

class CustomValues {
  selectValues: (string | number)[][] = [];
  constructor() {
    makeAutoObservable(this);
  }
}

const CUSTOM_VALUES = new CustomValues();

interface FieldFormProps {
  selected: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  fields: Record<string, Partial<CustomField> | null>;
  setField: React.Dispatch<React.SetStateAction<Record<string, Partial<CustomField> | null>>>;
}

function CustomFieldTypeOptions() {
  const options: JSX.Element[] = [];
  const keys = Object.keys(ReadableCustomFieldType);
  for (const key of keys) {
    options.push(<option key={key} value={key}>{(ReadableCustomFieldType as any)[key]}</option>);
  }

  return <>{options}</>;
}

/**
 * Renders the form to edit custom fields
 */
export function FieldForm(props: FieldFormProps) {
  if (!props.selected) { return <div style={{flexGrow: 1}}></div>; }
  const field = props.fields[props.selected];
  if (!field) { return <div style={{flexGrow: 1}}></div>; }

  /**
   * Saves the changes to the custom field
   * @param values The values of the custom field to set
   */
  function onSubmit(values: Partial<CustomField>) {
    if (!values.uuid) { return; }
    values.selectValues = CUSTOM_VALUES.selectValues;
    props.fields[values.uuid] = values;
    props.setField(props.fields);
    props.setSelected(undefined);
  }

  return (
    <div style={{flexGrow: 1}}>
      <Formik
        initialValues={field}
        onSubmit={onSubmit}
      >
        {(formikProps: FormikProps<any>) => {
          if (formikProps.values.uuid !== props.selected) {
            formikProps.setValues(field);
            CUSTOM_VALUES.selectValues = field.selectValues || [];
          }
          return (
            <>
              <Input type="text" name="name" label="Label"/>
              <Input type="text" name="key" label="Key"/>
              <label htmlFor="type">Field Type</label>
              <Select name="type" id="type">
                <CustomFieldTypeOptions/>
              </Select>

              <CustomFieldValuesForm
                type={formikProps.values.type}
                selectValues={formikProps.values.selectValues || []}
                setSelectValues={(values: any) => formikProps.setFieldValue("selectValues", values)}
              />

              {/* <CustomFieldDefaultValue type={f/> */}

              <Button type="button" onClick={() => props.setSelected(undefined)}>Cancel</Button>
              <Button
                type="button"
                onClick={() => onSubmit(formikProps.values)}
              >
                Save
              </Button>
            </>
          );
        }}
      </Formik>
    </div>
  );
}
