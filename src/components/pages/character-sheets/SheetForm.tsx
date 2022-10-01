import { Button } from "@chakra-ui/react";
import { Input } from "@owl-factory/components/form";
import { MonacoEditor } from "@owl-factory/components/form/Monaco";
import { ActorSheet } from "@prisma/client";
import { Form, Formik, FormikProps, useField } from "formik";
import React from "react";

interface SheetFormProps {
  sheet?: ActorSheet;
}

interface FormValues { 
  name: string;
  layout: string;
  rawStyling: string;
}


/**
 * Renders a form for modifying an actor sheet
 * @param sheet The sheet the form is used to edit
 */
export function SheetForm(props: SheetFormProps) {
  if (!props.sheet) { return <></>; }

  const initialValues = {
    name: props.sheet.name,
    layout: props.sheet.layout,
    rawStyling: props.sheet.rawStyling,
  };

  function refresh(formik: FormikProps<FormValues>) {
    console.log(formik.getFieldMeta("name"))
    console.log(formik.getFieldMeta("rawStyling"))
  }

  function onSubmit(values: any) {
    // TODO - save
  }

  return (
    <>
      {props.sheet.name}
      <br/>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        { (formikProps: FormikProps<FormValues>) => (
          <Form>
            <label>Name</label>
            <Input type="text" name="name"/>
            <label>Layout</label>
            <MonacoEditor name="layout" height="40vh" defaultLanguage="xml"/>
            <label>Styling</label>
            <MonacoEditor name="rawStyling" height="40vh" defaultLanguage="scss"/>
            <Button onClick={() => refresh(formikProps)}>Refresh</Button>
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}
