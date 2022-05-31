import { ActorSheetData } from "controllers/data/ActorSheetData";
import { Formik } from "formik";
import React from "react";
import { SheetElement } from "./SheetElement";

interface SheetPageProps {
  id: string;
  activeTab: number;
}

export function SheetPage(props: any) {
  const page = ActorSheetData.getPage(props.id, props.activeTab)
  const sheetElements: JSX.Element[] = [];
  
  for(const childElement of page.children || []) {
    sheetElements.push(
      <SheetElement id={props.id} element={childElement}/>
    )
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
}
