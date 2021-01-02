import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Page from "../../../components/design/Page";
import { useRouter } from "next/router";
import CommonEntityTypeForm from "../../../components/admin/commonEntityTypes/Form";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function NewCommonEntityTypeForm(): JSX.Element {
  const router = useRouter();
  return <CommonEntityTypeForm
    initialValues={{
      name: "",
      alias: "",
    }}
    onSubmit={(values: any) => {}}
  />;
}

/**
 * Renders a the page to create a new game system
 * @param themes The themes to render within the new game system form
 */
function NewCommonEntityType(): JSX.Element {
  return (
    <Page>
      <h1>Create Common Entity Type</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Entity Types",
        "Create Common Entity Type",
      ]}/>

      <br/>

      <NewCommonEntityTypeForm/>
    </Page>
  );
}

export default NewCommonEntityType;
