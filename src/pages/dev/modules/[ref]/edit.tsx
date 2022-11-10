import React from "react";
import { observer } from "mobx-react-lite";
import { Page } from "components/design";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { ModuleForm } from "components/lantern/modules/Form";
import { Module, Ruleset } from "@prisma/client";

/**
 * Renders a development page for editing a module
 */
const EditModule = observer(() => {
  const router = useRouter();
  const ref = router.query.ref as string;

  // Ensures that the module is fully loaded, if it isn't already
  const module = {} as Module;
  const ruleset = {} as Ruleset;

  return (
    <Page>
      <h1>Edit Module {module?.name}</h1>
      <Link href="/dev/modules"><Button>Back</Button></Link>
      {/* Ensures that the form isn't rendered until after the document is loaded in */}
      {
        (module && module) ?
        <ModuleForm module={module} rulesetRef={ruleset.id as string} /> :
        undefined
      }
    </Page>
  );
});

export default EditModule;
