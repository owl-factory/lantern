import { ActorSheetData } from "controllers/data/ActorSheetData";
import { Formik } from "formik";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  id: string;
}

/**
 * Renders an actor sheet
 * @param id The ref or temporary key of a sheet to load
 */
export const ActorSheet = observer((props: ActorSheetProps) => {
  const sheet = ActorSheetData.getSheet(props.id);
  const sheetElements: JSX.Element[] = [];

  // Renders each of the children of the base sheet
  for(const childElement of sheet.children || []) {
    sheetElements.push(
      <SheetElement element={childElement}/>
    );
  }

  return (
    <Formik
      initialValues={{}}
      onSubmit={console.log}
    >
      <>
        {sheetElements}
      </>
    </Formik>
  );
});

