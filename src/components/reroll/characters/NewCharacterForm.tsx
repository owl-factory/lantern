import React from "react";
import { Form, Formik } from "formik";
import { Input, Select } from "components/style/forms";
import { Button } from "components/style";
import { CharacterDocument, RulesetDocument } from "types/documents";
import { RulesetCache } from "controllers/cache/RulesetCache";
import { observer } from "mobx-react-lite";
import { RulesetSelect } from "../rulesets/RulesetSelect";
import { CampaignSelect } from "../campaigns/CampaignSelect";
import { CharacterCache } from "controllers/cache/CharacterCache";

interface NewCharacterFormValues {
  character: Partial<CharacterDocument>;
}

export function NewCharacterForm(props: any) {
  async function createNewCharacter(values: NewCharacterFormValues) {
    console.log(values);
    const character = await CharacterCache.create(values.character);
    console.log(character)
  }

  return (
    <Formik
      initialValues={{
        character: {
          name: "",
          ruleset: { ref: "" },
          campaign: { ref: "" },
        },
      }}
      onSubmit={createNewCharacter}
    >
      <Form>
        <Input type="text" name="character.name"/>
        <RulesetSelect name="character.ruleset.ref" />
        <CampaignSelect name="character.ruleset.ref" />

        <Button type="submit">Create</Button>
      </Form>
    </Formik>
  );
}
