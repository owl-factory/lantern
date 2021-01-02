import React from "react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import Page from "../../../../components/design/Page";
import Breadcrumbs from "../../../../components/design/Breadcrumbs";
import CommonContentTypeForm from "../../../../components/admin/commonContentTypes/Form";
import { CommonContentType } from "../../../../types/documents";

interface EditCommonContentTypeFormProps {
  commonContentType: CommonContentType;
}

interface EditCommonContentTypeProps {
  commonContentType: CommonContentType;
}

/**
 * Renders a new game system form
 * @param props.themes The themes to render within the form's theme dropdown
 */
export function EditCommonContentTypeForm(props: EditCommonContentTypeFormProps): JSX.Element {
  const router = useRouter();
  return <CommonContentTypeForm
    initialValues={{
      name: props.commonContentType.name,
      alias: props.commonContentType.alias,
    }}
    onSubmit={(values: any) => {
      const { alias } = router.query;
    }}
  />;
}

export default function EditCommonContentType({ commonContentType }: EditCommonContentTypeProps): JSX.Element {
  return (
    <Page>
      <h1>New {commonContentType.name} Module</h1>
      <Breadcrumbs skipLevels={1} titles={["Admin", "Common Content Types", commonContentType.name, "Edit" ]}/>
      <EditCommonContentTypeForm commonContentType={commonContentType} />
    </Page>
  );
}

EditCommonContentType.getInitialProps = async (ctx: NextPageContext) => {
  const { alias } = ctx.query;

  return {
    commonContentType: {},
  };
};
