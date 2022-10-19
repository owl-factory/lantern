import React from "react";
import { PageableDescriptor } from "nodes/view-renderer/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetPage } from "./Page";
import { StateType } from "nodes/actor-sheets/enums/stateTypes";
import { ViewRenderer } from "nodes/view-renderer";
import { observer } from "mobx-react-lite";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";
import { SheetElement } from "../../UnknownViewElement";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a section that contains one or multiple pages
 * @param element The SheetPage element description
 */
export const SheetPageable = observer((props: SheetElementProps<PageableDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<PageableDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  const activeTab = ViewRenderer.getState();
  //ActorController.getState(props.renderID, StateType.CurrentPage, props.element.id) as number || 0;
  const childElements = props.element.children || [];

  // Renders all the children that are not part of the pageable pages themself
  const nonPageChildren: JSX.Element[] = [];
  for (const childElement of childElements) {
    nonPageChildren.push(
      <SheetElement key={props.properties.$prefix + childElement.$key} {...props} element={childElement}/>
    );
  }

  return (
    <Box className={`pageable ${element.className}`}>
      {/* <SheetPage {...props} element={props.element.pages[activeTab]}/> */}
      <SheetChildren {...props} />
    </Box>
  );
});
