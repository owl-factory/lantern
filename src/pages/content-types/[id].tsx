import { Form, Formik } from "formik";
import { NextPageContext } from "next";
import React from "react";
import { Page } from "../../components";
import { Fields } from "../../components/reroll/rulesets/Fields";
import { ContentTypeDoc, ContentTypeField, RulesetDoc } from "../../types";
import { rest } from "../../utilities";

interface ContentTypePageProps {
  initialContentType: ContentTypeDoc;
  ruleset: RulesetDoc;
}

export function ContentTypePageProps({ initialContentType, ruleset }: ContentTypePageProps): JSX.Element {
  const [ isUpdated, setIsUpdated ] = React.useState(false);
  const [ contentType, _setContentType ] = React.useState(initialContentType);
  const [ fields, _setFields ] = React.useState(initialContentType.fields || {
    name: { name: "Name", key: "name", type: 0 },
  });

  /**
   * Sets the fields. Marks the content type as updated if not already
   * @param fields The fields to update
   */
  function setFields(newFields: Record<string, ContentTypeField>) {
    if (!isUpdated) { setIsUpdated(true); }
    _setFields(newFields);
  }

  /**
   * Saves the content type and all related data to the database
   * @param values The base content type to save to the database
   */
  function saveAll(values: ContentTypeDoc) {
    values.fields = fields;

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
              className={`btn btn-primary float-right ${isUpdated ? "" : "disabled"}`}
            >Save</button>
          </h1>
          <a href={`/rulesets/${ruleset._id}`}>&lt; {ruleset.name}</a>

          <br/><br/>
          <Fields fields={fields} setFields={setFields}/>
        </Form>
        )}
      </Formik>
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
