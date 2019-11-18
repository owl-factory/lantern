import { Checkbox, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { CharacterSheetContext } from "../Context";

/**
 * Renders the armor class of a character
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing the armor class information.
 */
export function ArmorClass(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <div title={context.character.armorClassReason}>{context.character.armorClass}</div>
      Armor Class
    </Typography>
  );
}

/**
 * Renders the death save information of a character
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing the hit dice information.
 */
export function DeathSaves(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <div>
        Successes
        <Checkbox />
        <Checkbox />
        <Checkbox />
      </div>

      <div>
        Failures
        <Checkbox />
        <Checkbox />
        <Checkbox />
      </div>
      <span title="Roll 1d20">Death Saves</span>
    </Typography>
  );
}

/**
 * Renders the hit dice of a character
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing the speed information.
 */
export function HitDice(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <div>Total {context.character.maxHitDice}</div>
      <div>{context.character.currentHitDice}</div>
      <span title="Roll 1d8">Hit Dice</span>
    </Typography>
  );
}

/**
 * Renders the hit points of a character
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing the hit point information.
 */
export function HitPoints(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <div>Hit Point Maximum {context.character.maxHP}</div>
      <div>{context.character.currentHP}</div>
      Current Hit Points
    </Typography>
  );
}

/**
 * Renders the initiative of a character
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing the initiative information.
 */
export function Initiative(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <div>{context.character.initiative}</div>
      Initiative
    </Typography>
  );
}

/**
 * Renders the amount of temporary hit points a character has
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing the Temporary Hitpoint information.
 */
export function TemporaryHitPoints(props: any) {
  const context = useContext(CharacterSheetContext);

  return (
    <Typography>
      <div>{context.character.temporaryHP}</div>
      Temporary Hit Points
    </Typography>
  );
}

/**
 * Renders the movable distance of a character in a turn
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing the speed information.
 */
export function Speed(props: any) {
  const context = useContext(CharacterSheetContext);
  return (
    <Typography>
      <div>{context.character.speed}</div>
      Speed
    </Typography>
  );
}

/**
 * Renders the whole of the Vitality section, including AC, HP,
 * Initiative, Speed, hit dice, and death saves
 *
 * @param character - the information on the current character
 * @param updateCharacter - the function to update the current character
 *
 * Returns a JSX Element containing all of the different vitality information.
 */
function Vitality(props: any) {
  return (
    <div>
      <div>
        <ArmorClass moduleSettings={module} />
        <Initiative moduleSettings={module} />
        <Speed moduleSettings={module} />
      </div>
      <HitPoints moduleSettings={module} />
      <TemporaryHitPoints moduleSettings={module} />

      <div>
        <HitDice moduleSettings={module} />
        <DeathSaves moduleSettings={module} />
      </div>
    </div>
  );
}

export default Vitality;
