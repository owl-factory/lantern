import React, { useContext } from "react";
import { renderCustomModules } from "./Modules";
import { CharacterSheetContext } from "../Context";
import { renderModules } from "../Modules";
import SheetTabs from "../SheetTabs";

/**
 * Renders a character sheet for Fifth Edition
 *
 * @param props
 *
 * Returns a Character Sheet
 */
export function CharacterSheet(props: any) {
  // Builds the state for the current character sheet
  const [state, setState] = React.useState({
    tab: 1,
  });

  // 
  const context = useContext(CharacterSheetContext);

  // Generates the content from the modules to render for the current tab 
  // of the character sheet
  const content = renderModules(
    context.sheetLayout.modules,
    state.tab,
    renderCustomModules,
  );

  return (
    <div>
      <SheetTabs tabs={context.sheetLayout.tabs} state={state} setState={setState}></SheetTabs>
      5e Character Sheet {context.character.name}
      <br />Content Page: {context.sheetLayout.tabs[state.tab]}
      <br />{content}
    </div>
  );
}

export default CharacterSheet;
