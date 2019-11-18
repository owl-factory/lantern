import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

/**
 * Renders the Passive Perception module
 * @param props
 */
function PassivePerception(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      {context.character.skillModifiers[context.rules.passiveWisdomIndex]}&nbsp;

      Passive&nbsp;
      {context.rules.attributeNames[context.rules.skillAttributes[context.rules.passiveWisdomIndex]]}&nbsp;
      ({context.rules.skillNames[context.rules.passiveWisdomIndex]})
    </Typography>
  );
}

export default PassivePerception;
