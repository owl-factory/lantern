import React, { useContext } from "react";

import Actions from "./Actions";
import Attributes from "./Attributes";
import Equipment from "./Equipment";
import Features from "./Features";
import Header from "./Header";
import Inspiration from "./Inspiration";
import PassivePerception from "./PassivePerception";
import Proficiencies from "./Proficiencies";
import ProficiencyBonus from "./ProficiencyBonus";
import SavingThrows from "./SavingThrows";
import Skills from "./Skills";
import Traits from "./Traits";
import {
  ArmorClass,
  DeathSaves,
  HitDice,
  HitPoints,
  Initiative,
  Speed,
  TemporaryHitPoints,
} from "./Vitality";

import { CharacterSheetContext } from "../Context";

/**
 * Renders the custom modules for the current character sheet type
 */
export function renderCustomModules(module: any) {
  switch (module.type.toLowerCase()) {
    case "actions":
      return <Actions moduleSettings={module} />;

    case "armorclass":
      return <ArmorClass moduleSettings={module} />;

    case "attributes":
      return <Attributes moduleSettings={module} />;

    case "deathsaves":
      return <DeathSaves moduleSettings={module} />;

    case "equipment":
      return <DeathSaves moduleSettings={module} />;

    case "features":
      return <Features moduleSettings={module} />;

    case "header":
      return <Header moduleSettings={module} />;

    case "hitdice":
      return <HitDice moduleSettings={module} />;

    case "hitpoints":
      return <HitPoints moduleSettings={module} />;

    case "inspiration":
      return <Inspiration moduleSettings={module} />;

    case "initiative":
      return <Initiative moduleSettings={module} />;

    case "passiveperception":
      return <PassivePerception moduleSettings={module} />;

    case "proficiencies":
      return <Proficiencies moduleSettings={module} />;

    case "proficiencybonus":
      return <ProficiencyBonus moduleSettings={module} />;

    case "traits":
      return <Traits moduleSettings={module} />;

    case "savingthrows":
      return <SavingThrows moduleSettings={module} />;

    case "skills":
      return <Skills moduleSettings={module} />;

    case "speed":
      return <Speed moduleSettings={module} />;

    case "temporaryhitpoints":
      return <TemporaryHitPoints moduleSettings={module} />;
  }
}
