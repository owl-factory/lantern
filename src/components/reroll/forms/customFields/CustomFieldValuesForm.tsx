import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { Formik, FormikProps } from "formik";
import React from "react";
import { CustomFieldType } from "types/enums/subdocument/CustomFieldType";

const ALLOWED_FIELD_TYPES = [CustomFieldType.Select, CustomFieldType.NumberSelect, CustomFieldType.Multiselect];

function CustomFieldValueItem(props: any) {
  const initialValues = {
    value: props.value[0],
    text: props.value[1],
  };

  function onSubmit(values: any) {
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

export function CustomFieldValuesForm(props: any) {
  if (!ALLOWED_FIELD_TYPES.includes(props.type)) { return <></>; }
  if (props.selectValues === undefined) { return <></>; }

  function addValue() {
    props.selectValues.push([props.selectValues.length, `Undefined`]);
    props.setSelectValues(props.selectValues);
    // props.customValues.selectValues.push([props.customValues.selectValues.length, "Untitled"]);
  }

  function updateValue(index: number, value: any) {
    // props.customValues.selectValues[index] = value;
    props.selectValues[index] = value;
    props.setSelectValues(props.selectValues);
  }

  function removeValue(index: number) {
    // props.customValues.selectValues.splice(index, 1);
    const selectValues = [...props.selectValues];
    selectValues.splice(index, 1);
    props.setSelectValues(selectValues);

  }

  const values: JSX.Element[] = [];
  for (let i = 0; i < props.selectValues.length; i++){
    values.push(
      <CustomFieldValueItem
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
