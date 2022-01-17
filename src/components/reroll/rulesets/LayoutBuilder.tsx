import React from "react";
import { Toolbox } from "components/design";

interface LayoutBuilderProps {
  layout: any;
  setLayout: (layout: any) => void;

  children: React.ReactNode;
}

function ToolboxContent() {
  return (
    <div className="layout-toolbox">
      <div className="trash">
        <div>Trash</div>
      </div>
    </div>
  );
}

// TODO, use or remove these props
export function LayoutBuilder(props: LayoutBuilderProps) {
  const [ open, setOpen ] = React.useState(false);

  return (
    <div className="layout-builder">
      {/* Side bar */}
      <Toolbox open={open} setOpen={setOpen}>
        <ToolboxContent/>
      </Toolbox>
      <h2>Layout</h2>
    </div>
  );
}
