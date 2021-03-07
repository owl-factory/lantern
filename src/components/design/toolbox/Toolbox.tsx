import React from "react";

interface ToolboxProps {
  open: boolean;
  setOpen: (open: boolean) => void;

  children: React.ReactNode;
}

export function Toolbox(props: ToolboxProps): JSX.Element {


  return (
    <div
      className={`toolbox ${props.open ? "open" : "closed"}`}
      onMouseEnter={() => props.setOpen(true)}
      onMouseLeave={() => props.setOpen(false)}
    >
      <div className="toolbox-arrow" onClick={() => props.setOpen(!props.open)}/>
      <div className="toolbox-content">
        {props.children}
      </div>
    </div>
  );
}
