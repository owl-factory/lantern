import { Grid, TextField } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Attributes(props: any) {
  /**
   * Renders the standard attribute block
   * @param attribute- a string of the attribute name. Ex 'strength'.
   *
   * Returns a JSX.Element containing an attribute block
   */
  function attributeBlock(index: number) {
    const block: JSX.Element[] = [];
    const attribute: string = context.rules.attributeNames[index];

    block.push(<div>{attribute.toUpperCase()}</div>);
    block.push(<TextField type="number" value={context.character.attributeValues[index]} />);
    block.push(<div>{context.character.attributeMods[index]}</div>);

    return <Grid item xs={12}>{block}</Grid>;
  }

  const context = useContext(CharacterSheetContext);
  const attributeBlocks: JSX.Element[] = [];

  // Determine layout 1x6, 2x3, 3x2, 6x1

  context.rules.attributeDisplayOrder.forEach((attributeIndex: number) => {
    attributeBlocks.push(attributeBlock(attributeIndex));
  });

  return <Grid container>{attributeBlocks}</Grid>;
}

export default Attributes;
