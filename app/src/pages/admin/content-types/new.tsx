import React from "react";
import Breadcrumbs from "../../../components/design/Breadcrumbs";
import Page from "../../../components/design/Page";
import { useRouter } from "next/router";
import CommonContentTypeForm from "../../../components/admin/commonContentTypes/Form";

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function NewCommonContentTypeForm(): JSX.Element {
  const router = useRouter();
  return <CommonContentTypeForm
    initialValues={{
      name: "",
      alias: "",
    }}
    onSubmit={(values: any) => {
      
    }}
  />;
}

/**
 * Renders a the page to create a new game system
 * @param themes The themes to render within the new game system form
 */
function NewCommonContentType(): JSX.Element {
  return (
    <Page>
      <h1>Create Common Content Type</h1>
      <Breadcrumbs skipLevels={1} titles={[
        "Admin",
        "Content Types",
        "Create Common Content Type",
      ]}/>

      <br/>

      <NewCommonContentTypeForm/>
    </Page>
  );
}

export default NewCommonContentType;
