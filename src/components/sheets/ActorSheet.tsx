import { ActorSheetData } from "controllers/data/ActorSheetData";
import { Form, Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  id: string;
  onSubmit: (values: Record<string, unknown>) => void;
}

/**
 * Renders an actor sheet
 * @param id The ref or temporary key of a sheet to load
 */
export const ActorSheet = observer((props: ActorSheetProps) => {
  const sheet = ActorSheetData.getSheet(props.id);

  return (
    <Formik
      initialValues={{}}
      
      onSubmit={console.log}
    >
      {(formikProps: FormikProps<Record<string, unknown>>) => {
        // Renders each of the children of the base sheet
        const sheetElements: JSX.Element[] = [];

        function onChange(e: any) {
          console.log(e)
          // props.onSubmit(formikProps.values);
          return;
        } 

        for(const childElement of sheet.children || []) {
          sheetElements.push(
            <SheetElement element={childElement} />
          );
        }

        return (
          <>
            {sheetElements}
          </>
        );
      }}
    </Formik>
  );
});

