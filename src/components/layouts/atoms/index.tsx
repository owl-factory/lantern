import React from "react";
import { AtomType } from "../../../types/enums/atomType";
import { AtomProps } from "../../../types/layouts/atom";
import { Action } from "./Action";
import { AtomError } from "./AtomError";
import { LabeledText } from "./LabeledText";
import { MultiselectInput } from "./Multiselect";
import { Submit } from "./Submit";
import { TernaryInput } from "./TernaryInput";
import { Text } from "./Text";
import { TextInput } from "./TextInput";

/**
 * Renders a singlular atom
 * @param props.atom The definition of the atom to render
 */
export function DynamicAtom(props: AtomProps): JSX.Element {
  try {
    switch(props.atom.type) {
      case AtomType.Action:
        return <Action {...props}/>;
      case AtomType.LabeledText:
        return <LabeledText {...props} />;
      case AtomType.MultiselectInput:
        return <MultiselectInput {...props}/>;
      case AtomType.Submit:
        return <Submit {...props}/>;
      case AtomType.TernaryInput:
        return <TernaryInput {...props}/>;
      case AtomType.Text:
        return <Text {...props}/>
      case AtomType.TextInput:
        return <TextInput {...props}/>;
      default:
        return <AtomError w={props.atom.w} errors="An invalid AtomType was given."/>;
      
    }
  } catch (error) {
    // Last ditch error catch to prevent the whole page from crashing
    return <AtomError w={props.atom.w} errors={error.message}/>
  }
}
