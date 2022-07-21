import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@owl-factory/components/button";
import { ModuleData } from "controllers/data/ModuleData";
import { ModuleForm } from "components/reroll/modules/Form";

/**
 * Renders a development page for editing a module
 */
const EditModule = observer(() => {
  const router = useRouter();
  const ref = router.query.ref as string;

  // Ensures that the module is fully loaded, if it isn't already
  React.useEffect(() => {
    ModuleData.load(ref);
  }, [ref]);
  const module = ModuleData.get(ref);

  return (
    <Page>
      <h1>Edit Module {module?.name}</h1>
      <Link href="/dev/modules"><Button>Back</Button></Link>
      {/* Ensures that the form isn't rendered until after the document is loaded in */}
      {
        (module && module.ruleset) ?
        <ModuleForm module={module} rulesetRef={module.ruleset?.ref as string} /> :
        undefined
      }
    </Page>
  );
});

export default EditModule;
