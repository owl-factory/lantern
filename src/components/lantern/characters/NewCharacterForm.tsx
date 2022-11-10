import React from "react";
import { Form, Formik } from "formik";
import { CharacterDocument } from "types/documents";
import { RulesetSelect } from "../rulesets/RulesetSelect";
import { CampaignSelect } from "../campaigns/CampaignSelect";
import { Button, Input } from "@chakra-ui/react";

interface NewCharacterFormValues {
  character: Partial<CharacterDocument>;
}

export function NewCharacterForm() {
  async function createNewCharacter(values: NewCharacterFormValues) {
    // const character = await CharactersData.create(values.character);
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
