import { ApolloError, gql, useMutation } from "@apollo/client";
import { Button } from "@chakra-ui/react";
import { AlertController } from "@owl-factory/alerts";
import { Input } from "@owl-factory/components/form";
import { MonacoEditor } from "@owl-factory/components/form/Monaco";
import { rest } from "@owl-factory/https";
import { ActorSheet } from "@prisma/client";
import { Form, Formik, FormikProps, useField } from "formik";
import { ActorController } from "nodes/actor-sheets";
import React from "react";

interface SheetFormProps {
  sheet?: ActorSheet;
}

// The values used and submitted within the form
interface FormValues {
  name: string;
  layout: string;
  rawStyling: string;
}

// A mutation to edit an actor sheet
const MUTATE_ACTOR_SHEET = gql`
  mutation MutateActorSheet($id: String!, $actorSheet: ActorSheetMutateInput!) {
    mutateActorSheet(id: $id, actorSheet: $actorSheet) {
      id, name, layout, styling
    }
  }
`;

/**
 * Renders a form for modifying an actor sheet
 * @param sheet The sheet the form is used to edit
 */
export function SheetForm(props: SheetFormProps) {
  const [ mutateActorSheet ] = useMutation(MUTATE_ACTOR_SHEET);
  if (!props.sheet) { return <></>; }

  // Initial form values
  const initialValues = {
    name: props.sheet.name,
    layout: props.sheet.layout,
    rawStyling: props.sheet.rawStyling,
  };

  /**
   * Refreshes the current sheet layout and styling rendered
   * @param formik The formik props to extract values from
   */
  async function refresh(formik: FormikProps<FormValues>) {
    if (!props.sheet) { return; }
    const rawStyling = `.actor-sheet-${props.sheet.id} { ${formik.values.rawStyling} }`;

    const cssResult = await rest.post<{ css: string }>(`/api/sass`, { sass: rawStyling });
    ActorController.loadSheet(props.sheet.id, { layout: formik.values.layout, styling: cssResult.data.css});
  }

  /**
   * Messages an alert after the successful mutation
   * @param data The data from a successful mutation
   */
  function onCompleted(data: { mutateActorSheet: ActorSheet }) {
    AlertController.success(`${data.mutateActorSheet.name} was successfully updated`);
    ActorController.loadSheet(
      data.mutateActorSheet.id,
      { layout: data.mutateActorSheet.layout, styling: data.mutateActorSheet.styling}
    );
  }

  /**
   * Handles the case where the actor sheet fails to mutate
   * @param error The error returned by Apollo
   */
   function onError(error: ApolloError, name: string) {
    console.error(error);
    AlertController.error(`${name} could not be updated`);
  }

  /**
   * Submits the form
   * @param values The submitted values of the form
   */
  function onSubmit(values: FormValues) {
    if (!props.sheet) { return; }
    mutateActorSheet({
      variables: {
        id: props.sheet.id,
        actorSheet: values,
      },
      refetchQueries: ["GetMyCharacterSheets"],
      onCompleted,
      onError: (error: ApolloError) => onError(error, values.name),
    });
  }

  return (
    <>
      {props.sheet.name}
      <br/>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
      >
        { (formikProps: FormikProps<FormValues>) => {
          React.useEffect(() => {
            if (!props.sheet) { return; }
            formikProps.setValues({
              name: props.sheet.name,
              layout: props.sheet.layout,
              rawStyling: props.sheet.rawStyling,
            });
          }, [props.sheet]);
          return (
            <Form>
              <label>Name</label>
              <Input type="text" name="name"/>
              <label>Layout</label>
              <MonacoEditor name="layout" height="30vh" defaultLanguage="xml"/>
              <label>Styling</label>
              <MonacoEditor name="rawStyling" height="30vh" defaultLanguage="scss"/>
              <Button onClick={() => refresh(formikProps)}>Refresh</Button>
              <Button type="submit">Submit</Button>
            </Form>
          );
        }
      }
      </Formik>
    </>
  );
}
