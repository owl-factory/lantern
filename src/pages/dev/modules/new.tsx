import { Button } from "@owl-factory/components/button";
import { Page } from "components/design";
import { ModuleForm } from "components/reroll/modules/Form";
import Link from "next/link";
import React from "react";



export default function NewModule() {
  return (
    <Page>
      <h1>New Module</h1>
      <Link href="/dev"><Button>Back</Button></Link>
      <ModuleForm/>
    </Page>
  );
}
