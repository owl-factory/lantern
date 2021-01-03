import React from "react";
import Page from "../../components/design/Page";
import { AtomType } from "../../components/layouts/atoms";
import { CardLayout } from "../../components/layouts/CardLayout";
import { MoleculeType } from "../../components/layouts/molecules";

export default function ID(props: any) {
  return (
    <Page>
      <CardLayout
        content={props.content}
        contentType={props.contentType}
        rules={props.rules}
      />
    </Page>
  )
}

ID.getInitialProps = () => {
  return {
    content: {
      name: "Fire Bolt",
      description: "You hurl a mote of fire at a creature or object within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 fire damage. A flammable object hit by this spell ignites if it isn’t being worn or carried. This spell’s damage increases by 1d10 when you reach 5th level (2d10), 11th level (3d10), and 17th level (4d10).",
      data: {
        classes_readable: "Sorcerer, Wizard",
        components_readable: "V S",
        casting_time: "1 Action",
        level_readable: "cantrip",
        range: "120 feet",
        school: "evocation"
      }
    },
    contentType: {
      layout: {
        header: [
          { type: AtomType.Text, dynamicValues: { text: "content.name" } }
        ],
        body: [
          { type: MoleculeType.Div, atoms: [
            { type: AtomType.Text, dynamicValues: { text: "content.data.level_readable" } },
            { type: AtomType.Text, dynamicValues: { text: "content.data.school" } },
          ]},
          { type: AtomType.LabeledText, dynamicValues: { text: "content.data.casting_time"}, staticValues: { label: "Casting Time:"}},
          { type: AtomType.LabeledText, dynamicValues: { text: "content.data.range"}, staticValues: { label: "Range:"}},
          { type: AtomType.LabeledText, dynamicValues: { text: "content.data.components_readable"}, staticValues: { label: "Components:"}},
          { type: AtomType.LabeledText, dynamicValues: { text: "content.data.duration"}, staticValues: { label: "Duration:"}},
          { type: AtomType.LabeledText, dynamicValues: { text: "content.data.classes_readable"}, staticValues: { label: "Classes:"}},
          { type: AtomType.Text, dynamicValues: { text: "content.description"}},
        ]
      }
    },
    rules: []
  }
}
