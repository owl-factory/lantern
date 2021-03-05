import { Form, Formik } from "formik";
import { NextPageContext } from "next";
import React from "react";
import { LayoutBuilder, Page } from "../../components";
import { Fields } from "../../components/reroll/rulesets/Fields";
import { ContentTypeDoc, FieldType, RulesetDoc } from "../../types";
import { rest } from "../../utilities";

interface ContentTypePageProps {
  initialContentType: ContentTypeDoc;
  ruleset: RulesetDoc;
}

export function ContentTypePageProps({ initialContentType, ruleset }: ContentTypePageProps): JSX.Element {
  const [ isUpdated, setIsUpdated ] = React.useState(false);
  const [ contentType, _setContentType ] = React.useState(initialContentType);
  const [ fields, _setFields ] = React.useState(initialContentType.fields || {});
  const [ layout, _setLayout ] = React.useState(initialContentType.layout || []);

  function setLayout(newLayout: any) {
    if (!isUpdated) { setIsUpdated(true); }
    _setLayout(newLayout);
  }

  /**
   * Sets the fields. Marks the content type as updated if not already
   * @param fields The fields to update
   */
  function setFields(newFields: Record<string, FieldType>) {
    if (!isUpdated) { setIsUpdated(true); }
    _setFields(newFields);
  }

  /**
   * Saves the content type and all related data to the database
   * @param values The base content type to save to the database
   */
  function saveAll(values: ContentTypeDoc) {
    values.fields = fields;
    rest.patch(
      `/api/content-types/${initialContentType._id}`,
      values as unknown as Record<string, unknown>
    );

    setIsUpdated(false);
  }

  return (
    <Page>
      <Formik initialValues={contentType} onSubmit={saveAll}>
        {() => (
        <Form>
          <h1>
            {contentType.name}
            <button
              type="submit"
              className={`btn btn-primary float-end ${isUpdated ? "" : "disabled"}`}
            >Save</button>
          </h1>
          <a href={`/rulesets/${ruleset._id}`}>&lt; {ruleset.name}</a>
        </Form>
        )}
      </Formik>

      <br/><br/>
      <Fields fields={fields} setFields={setFields}/>
      <br/>
      <LayoutBuilder>
        <p>Hi</p>
      </LayoutBuilder>
    </Page>
  );
}

ContentTypePageProps.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.get<any>(`/api/pages/content-types/${ctx.query.id}`);

  return {
    initialContentType: res.data.contentType,
    ruleset: res.data.ruleset,
  };
};

export default ContentTypePageProps;
