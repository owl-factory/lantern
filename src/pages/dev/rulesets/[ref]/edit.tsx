import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { RulesetData } from "controllers/data/RulesetData";
import { useRouter } from "next/router";
import { toJS } from "mobx";

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
  console.log("js rs", toJS(ruleset))
  return (
    <Page>
    </Page>
  );
});

export default EditRuleset;
