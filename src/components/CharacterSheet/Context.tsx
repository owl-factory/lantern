import React from "react";

interface Context {
  character: any;
  setChatacter: any;
  sheetLayout: any;
  classes: any;
  rules: any;
}

// Can we put multiple contexts in this file to share?
export const CharacterSheetContext = React.createContext<Partial<Context>>({});
