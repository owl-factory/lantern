import React from "react";
import { StaticVariable } from "types/documents/subdocument/StaticVariable";

interface StaticVariableFormProps {
  initialStaticVariable?: StaticVariable;
}

export function StaticVariableForm(props: StaticVariableFormProps) {
  if (!props.initialStaticVariable) { return <></>; }
  return (
    <div>
      
    </div>
  )
}