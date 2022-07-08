import { Button } from "@owl-factory/components/button";
import { ActorController } from "controllers/actor/ActorController";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  id: string;
  onSubmit?: (values: Record<string, unknown>) => void;
}

/**
 * Renders an actor sheet
 * @param id The ref or temporary key of a sheet to load
 */
export const ActorSheet = observer((props: ActorSheetProps) => {
  const sheet = ActorController.getSheet(props.id);
  const actor = ActorController.getActor(props.id);

  // Renders each of the children of the base sheet
  const sheetElements: JSX.Element[] = [];
  for(const childElement of sheet.children || []) {
    sheetElements.push(
      <SheetElement id={props.id} element={childElement} />
    );
  }

  return (
    <Formik
      initialValues={actor || {}}
      onSubmit={props.onSubmit || console.log}
    >
      {(formikProps: FormikProps<any>) => {
        React.useEffect(() => {
          formikProps.setValues(actor);
        }, [actor]);
        return (
          <Form>
            <Button type="submit">Save</Button>
            {sheetElements}
          </Form>
        );
      }}
    </Formik>
  );
});

