import { Button } from "@owl-factory/components/button";
import { ActorController } from "controllers/actor/ActorController";
import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  id: string;
  onSubmit?: (values: Record<string, unknown>) => void;
  values?: Record<string, unknown>;
}

/**
 * Renders an actor sheet
 * @param id The ref or temporary key of a sheet to load
 */
export const ActorSheet = observer((props: ActorSheetProps) => {
  const sheet = ActorController.getSheet(props.id);

  // Renders each of the children of the base sheet
  const sheetElements: JSX.Element[] = [];
  for(const childElement of sheet.children || []) {
    sheetElements.push(
      <SheetElement id={props.id} element={childElement} />
    );
  }

  return (
    <Formik
      initialValues={props.values || {}}
      onSubmit={props.onSubmit || console.log}
    >
        <Form>
          <Button type="submit">Save</Button>
          {sheetElements}
        </Form>
    </Formik>
  );
});

