import { Button, Input } from "@chakra-ui/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { Formik, FormikProps } from "formik";
import React from "react";
import { CustomFieldType } from "types/enums/subdocument/CustomFieldType";

// The list of fields that are allowed to render the custom field value type form
const ALLOWED_FIELD_TYPES = [CustomFieldType.Select, CustomFieldType.NumberSelect, CustomFieldType.Multiselect];

interface CustonSelectValueItemProps {
  index: number;
  value: (number | string)[];
  removeValue: (index: number) => void;
  updateValue: (index: number, value: (number | string)[]) => void;
}

/**
 * Renders a table row containing a form to update the custom field select value
 * @param index The position of this value in an array
 * @param value A pseudo-tuple containing the value and text of select options
 * @param removeValue A function to remove the value
 * @param updateValue A function to update the value
 */
function CustomSelectValueItem(props: CustonSelectValueItemProps) {
  const initialValues = {
    value: props.value[0],
    text: props.value[1],
  };

  /**
   * Saves the new values using the updateValue form
   * @param values The new values from the form
   */
  function onSubmit(values: { value: string | number, text: string | number }) {
    props.updateValue(props.index, [values.value, values.text]);
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<any>) => {
        React.useEffect(() => {
          formikProps.setValues({
            value: props.value[0],
            text: props.value[1],
          });
        }, [props.value[0], props.value[1]]);
        return (
          <TableRow>
            <TableCell>{props.index}</TableCell>
            <TableCell><Input type="text" name="value" onBlur={formikProps.submitForm}/></TableCell>
            <TableCell><Input type="text" name="text" onBlur={formikProps.submitForm}/></TableCell>
            <TableCell>
              <a href="#" onClick={() => props.removeValue(props.index)}>Remove</a>
            </TableCell>

        </TableRow>);
      }}
    </Formik>
  );
}

interface CustomSelectValuesFormProps {
  type: CustomFieldType;
  selectValues: (number | string)[][];
  setSelectValues: (selectValues: (number | string)[][]) => void;
}

/**
 * Renders a form for updating the custom select values
 * @param type The custom field type used by the current custom field
 * @param selectValues An array of pseudo-tuples containing the value and text of a select option
 * @param setSelectValues A function to set the select values of the parent form
 */
export function CustomSelectValuesForm(props: CustomSelectValuesFormProps) {
  if (!ALLOWED_FIELD_TYPES.includes(props.type)) { return <></>; }
  if (props.selectValues === undefined) { return <></>; }

  /**
   * Adds a new select value
   */
  function addValue() {
    props.selectValues.push([props.selectValues.length, `Undefined`]);
    props.setSelectValues(props.selectValues);
  }

  /**
   * Updates a value in the selectValues property
   * @param index The index of the value in the select values array to update
   * @param value The new pseudo-tuple value
   */
  function updateValue(index: number, value: any) {
    props.selectValues[index] = value;
    props.setSelectValues(props.selectValues);
  }

  /**
   * Removes a single value from the selectValues array
   * @param index The index of the value to remove from the selectValues array
   */
  function removeValue(index: number) {
    const selectValues = [...props.selectValues];
    selectValues.splice(index, 1);
    props.setSelectValues(selectValues);
  }

  const values: JSX.Element[] = [];
  for (let i = 0; i < props.selectValues.length; i++){
    values.push(
      <CustomSelectValueItem
        key={i}
        value={props.selectValues[i]}
        index={i}
        updateValue={updateValue}
        removeValue={removeValue}
      />
    );
  }

  return (
    <div>
      <div>
        <Button type="button" onClick={addValue}>+</Button>
      </div>
      <Table>
        <TableHead>
          <TableHeader></TableHeader>
          <TableHeader>Value</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader></TableHeader>
        </TableHead>
        <TableBody>
          {values}
        </TableBody>
      </Table>
    </div>
  );
}
