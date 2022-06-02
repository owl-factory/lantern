import { ActorSheetData } from "controllers/data/ActorSheetData";
import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElement } from "./SheetElement";

/**
 * Renders an actor sheet
 */
export const ActorSheet = observer((props: any) => {
  React.useEffect(() => {
    ActorSheetData.loadSheet("test", props.xml);
  }, [props.xml]);

  const page = ActorSheetData.getPage("test");
  const sheetElements: JSX.Element[] = [];

  for(const childElement of page.children || []) {
    sheetElements.push(
      <SheetElement id={props.id} element={childElement}/>
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

