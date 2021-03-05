import React from "react";
import { Toolbox } from "../..";

interface LayoutBuilderProps {
  children: React.ReactNode;
}

export function LayoutBuilder(props: LayoutBuilderProps) {
  const [ open, setOpen ] = React.useState(false);

  return (
    <div className="layout-builder">
      {/* Side bar */}
      <Toolbox open={open} setOpen={setOpen}><p>Hi</p></Toolbox>
      <h2>Layout</h2>
    </div>
  );
}