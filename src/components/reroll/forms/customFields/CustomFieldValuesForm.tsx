import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "components/elements/table";
import { Formik, FormikProps } from "formik";
import React from "react";
import { newCustomSelectValue } from "types/documents/subdocument/CustomField";
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
      {(formikProps: FormikProps<any>) =>(
        <TableRow>
          <TableCell>{props.index}</TableCell>
          <TableCell><Input type="text" name="value" onBlur={formikProps.submitForm}/></TableCell>
          <TableCell><Input type="text" name="text" onBlur={formikProps.submitForm}/></TableCell>
          <TableCell>
            <a href="#" onClick={() => props.removeValue(props.index)}>Remove</a>
          </TableCell>

       </TableRow>
      )}
    </Formik>
  );
}

export function CustomFieldValuesForm(props: any) {
  if (!ALLOWED_FIELD_TYPES.includes(props.type)) { return <></>; }
  React.useEffect(() => {
    if (props.values === undefined || props.values === null) {
      props.setValues({});
    }
  }, []);

  if (props.values === undefined) { return <></>; }

  function addValue() {
    const customSelectValue = newCustomSelectValue();
    customSelectValue.order = Object.keys(props.values).length;

    props.values[customSelectValue.uuid] = customSelectValue;
    props.setValues(props.values);
  }

  function updateValue(index: number, value: any) {
    props.values[index] = value;
    props.setValues(props.values);
  }

  function removeValue(index: number) {
    console.log("Remove")
    console.log(props.values)
    console.log(index)
    const values = [...props.values];
    const newValues = values.splice(index, 1);
    console.log(values)
    console.log(newValues)
    props.setValues(newValues);
  }

  const values: JSX.Element[] = [];
  const keys = Object.keys()
  // let i = 0;
  // for (const value of props.values) {
  //   values.push(
  //     <CustomFieldValueItem key={i} value={value} updateValue={updateValue} removeValue={removeValue} index={i}/>
  //   );
  //   i++;
  // }

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

type OrderObject = Record<string, unknown> & { order: number }

function orderObjects(objects: OrderObject[])