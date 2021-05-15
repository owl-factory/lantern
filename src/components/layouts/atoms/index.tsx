import React from "react";
import { AtomType } from "types/enums";
import { AtomProps } from "types/layouts";
import {
  Action,
  AtomError,
  LabeledText,
  MultiselectInput,
  Submit,
  TernaryInput,
  Text,
  TextInput,
} from "components/layouts/atoms";

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
        return <Text {...props}/>;
      case AtomType.TextInput:
        return <TextInput {...props}/>;
      default:
        return <AtomError w={props.atom.w} errors="An invalid AtomType was given."/>;

    }
  } catch (error) {
    // Last ditch error catch to prevent the whole page from crashing
    return <AtomError w={props.atom.w} errors={error.message}/>;
  }
}

export * from "components/layouts/atoms/Action";
export * from "components/layouts/atoms/AtomError";
export * from "components/layouts/atoms/LabeledText";
export * from "components/layouts/atoms/Multiselect";
export * from "components/layouts/atoms/Submit";
export * from "components/layouts/atoms/TernaryInput";
export * from "components/layouts/atoms/Text";
export * from "components/layouts/atoms/TextInput";
