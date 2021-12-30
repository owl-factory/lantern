import React from "react";
import { Form, Formik } from "formik";
import { Input, Select } from "components/style/forms";
import { Button } from "components/style";
import { CharacterDocument, RulesetDocument } from "types/documents";
import { RulesetCache } from "controllers/cache/RulesetCache";

interface NewCharacterFormValues {
  character: Partial<CharacterDocument>;
}


function RulesetSelect(props: any) {
  const [ rulesets, setRulesets ] = React.useState<Partial<RulesetDocument>[]>([]);

  React.useEffect(() => {
    const cachedRulesets = RulesetCache.getPage({ sort: "name" });
    console.log(cachedRulesets);
    setRulesets(cachedRulesets);
  }, [RulesetCache]);

  return (
    <Select name={props.name}>
      
    </Select>
  )
}

export function NewCharacterForm(props: any) {
  function createNewCharacter(values: NewCharacterFormValues) {
    console.log(values);
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
        <Button type="submit">Create</Button>
      </Form>
    </Formik>
  );
}
