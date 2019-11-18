import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Features(props: any) {
  function renderFeature(index: number) {
    return (
      <div>
        {context.character.features[index].title}<br />
        {context.character.features[index].sourceText}<br />
        {context.character.features[index].description}
      </div>
    );
  }

  const context = useContext(CharacterSheetContext);
  const featureRows: JSX.Element[] = [];

  context.character.featureDisplayOrder.forEach((index: number) => {
    featureRows.push(renderFeature(index));
  });

  return <Typography>{featureRows}</Typography>;
}

export default Features;
