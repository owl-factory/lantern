import React from "react";

export function AppPage({children}: any): JSX.Element {
  return (
    <div className="container-fluid" style={{paddingTop: "0.75rem"}}>
      {children}
    </div>
  );
}
