import { Button } from "@chakra-ui/react";
import { Page } from "components/design";
import { ModuleForm } from "components/lantern/modules/Form";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

/**
 * Renders a form for creating a new module
 */
export default function NewModule() {
  const router = useRouter();
  return (
    <Page>
      <h1>New Module</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ModuleForm rulesetRef={router.query.ref as string}/>
    </Page>
  );
}
