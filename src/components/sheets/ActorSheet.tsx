import { ActorSheetData } from "controllers/data/ActorSheetData";
import { Formik } from "formik";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElement } from "./SheetElement";

interface ActorSheetProps {
  xml: string;
}

/**
 * Renders an actor sheet
 * @param xml The XML string to render into a form
 */
export const ActorSheet = observer((props: ActorSheetProps) => {
  // Loads the actor sheet from the testing xml
  // TODO - move this elsewhere; the actor sheet should only pull the sheet id
  React.useEffect(() => {
    ActorSheetData.loadSheet("test", props.xml);
  }, [props.xml]);

  const sheet = ActorSheetData.getSheet("test");
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

