import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { RulesetData } from "controllers/data/RulesetData";
import { useRouter } from "next/router";
import { RulesetForm } from "components/reroll/rulesets/Form";
import Link from "next/link";
import { Button } from "@owl-factory/components/button";

/**
 * Renders a development page for editing a ruleset
 */
const EditRuleset = observer(() => {
  const router = useRouter();
  const rulesetRef = router.query.ref as string;

  // Ensures that the ruleset is fully loaded, if it isn't already
  React.useEffect(() => {
    RulesetData.load(rulesetRef);
  }, [rulesetRef]);
  const ruleset = RulesetData.get(rulesetRef);

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
