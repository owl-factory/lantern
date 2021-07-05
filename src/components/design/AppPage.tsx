import React from "react";

interface AppPageProps {
  children: React.ReactNode;
}

/**
 * Renders a fluid container for applications
 * @param children The containers of the App Page
 */
export function AppPage({children}: AppPageProps): JSX.Element {
  return (
    <div className="container-fluid" style={{paddingTop: "0.75rem"}}>
      {children}
    </div>
  );
}
