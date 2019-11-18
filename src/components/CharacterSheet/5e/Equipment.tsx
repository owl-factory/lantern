import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

function Equipment(props: any) {
  function renderCurrencyRow(index: number) {
    return (
      <div>
        {context.rules.currencies[index]}&nbsp;
        {context.character.currencies[index]}
      </div>
    );
  }

  /**
   * Renders the equipment row
   *
   * @param index the index of the equipment being viewed
   */
  function renderEquipmentRow(index: number) {
    const equipment: any = context.character.equipment[index];

    return (
      <div>
        {equipment.name}&nbsp;
        {equipment.quantity}&nbsp;
        {equipment.weight} ({equipment.weight * equipment.quantity})&nbsp;
      </div>
    );
  }

  const context = useContext(CharacterSheetContext);
  const currencyRows: JSX.Element[] = [];
  const equipmentRows: JSX.Element[] = [];

  context.rules.currencyDisplayOrder.forEach((index: number) => {
    currencyRows.push(renderCurrencyRow(index))
  });

  context.character.equipmentDisplayOrder.forEach((index: number) => {
    equipmentRows.push(renderEquipmentRow(index));
  });

  return (
    <div>
      <span>
        {currencyRows}
        {equipmentRows}
      </span>
      <div>Equipment</div>
    </div>
  );
}

export default Equipment;
