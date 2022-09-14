import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { useRouter } from "next/router";
import { RulesetForm } from "components/reroll/rulesets/Form";
import Link from "next/link";
import { Button } from "@owl-factory/components/button";
import { toJS } from "mobx";
import { Ruleset } from "@prisma/client";

/**
 * Renders a development page for editing a ruleset
 */
const EditRuleset = observer(() => {
  const router = useRouter();
  const rulesetRef = router.query.ref as string;

  const ruleset = {} as Ruleset;

  return (
    <Page>
      <h1>Edit Ruleset {ruleset?.name}</h1>
      <Link href="/dev/rulesets"><Button>Back</Button></Link>
      {/* Ensures that the Ruleset isn't rendered until after the document is loaded in */}
      { ruleset ? <RulesetForm ruleset={ruleset}/> : undefined }
    </Page>
  );
});

export default EditRuleset;
