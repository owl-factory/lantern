import { ErrorMessage, Form, Formik } from "formik";
import { NextPageContext } from "next";
import Error from 'next/error';
import { useRouter } from "next/router";
import React from "react";
import { Button, Card, Col, FormGroup, FormLabel, Row } from "react-bootstrap";
import { MdInfo, MdBuild, MdBlock } from "react-icons/md";
import { Breadcrumbs, ContextMenu, IndexTable, Input, Modal, Page } from "../../components";
import { ContentTypeDoc, RulesetDoc, TableComponentProps } from "../../types";
import { ContextMenuBuilder, TableBuilder, rest } from "../../utilities";
import * as Yup from "yup";

interface FetchContentTypeData {
  contentTypes: ContentTypeDoc[];
  contentTypeCount: number;
}

interface RulesetPageProps {
  contentTypes: ContentTypeDoc[];
  contentTypeCount: number;
  ruleset: RulesetDoc;
}

interface FetchRulesetData {
  ruleset: RulesetDoc;
}

const initialContentTypeLimit = 10;
const initialContentTypeSort = "name";


/**
 * Deletes a single context type
 * @param context the content type context that indicates relevant data for deleting
 */
async function deleteContentType(context: ContentTypeDoc): Promise<void> {
  if (confirm(`Are you sure you want to delete ${context.name}?`)) {
    await rest.delete(`/api/content-types/${context._id}`, {});
  }
}

// Adds actions for the table builder
const contentTypeActions = new ContextMenuBuilder()
.addLink("Details", MdInfo, "/content-types/[alias]")
.addLink("Edit", MdBuild, "/content-types/[alias]/edit")
.addItem("Delete", MdBlock, (context: ContentTypeDoc) => (deleteContentType(context)));

// Builds the table columns
const contentTypeTableBuilder = new TableBuilder()
.addIncrementColumn("")
.addDataColumn("Content Type", "name", { sortable: true })
.addComponentColumn("Tools", ContentTypeActions);

/**
 * Renders the actions for the rulesets page
 * @param data A ruleset object
 */
function ContentTypeActions({ data }: TableComponentProps) {
  return (
    <ContextMenu
      context={{_id: data._id, name: data.name, alias: data.alias || data._id, rulesetID: data.rulesetID}}
      {...contentTypeActions.renderConfig()}
    />
  );
}

/**
 * Renders a form to create new content types
 */
function NewContentTypeForm(): JSX.Element {
  const router = useRouter();
  const rulesetID = router.query.id;

  /**
   * Runs the submit action of the create game system form and handles
   * the success and failure results
   *
   * @param values The values from the form to submit
   */
  async function onSubmit(values: Record<string, string>) {
    values.rulesetID = rulesetID as string;
    const response = await rest.put<{ contentType: ContentTypeDoc }>(
      `/api/content-types`,
      values
    );
    if (!response.success) {
      alert(response.message);
      return;
    }

    const href = `/content-types/${response.data.contentType._id}`;
    router.push(href);
  }

  return (
    <Formik
      initialErrors={ {} }
      initialValues={ { name: "" } }
      onSubmit={onSubmit}
      validationSchema={Yup.object({
        name: Yup.string()
          .required("Required")
          .max(100, "Maximum of 100 characters"),
      })}
    >
      {() => (
        <Form>
          {/* Just name for now */}
          <Row>
            <FormGroup as={Col} xs={12} lg={6}>
              <FormLabel>Content Type Name</FormLabel>
              <Input name="name"/>
              <ErrorMessage name="name"/>
            </FormGroup>
          </Row>

          <Button type="submit">Submit!</Button>
        </Form>
      )}
    </Formik>
  );
}

/**
 * Renders a modal for the Rulesets Page to create a new ruleset
 *
 * @param handleClose The function that handles closing the modal
 * @param modal Boolean. Show the modal if true.
 */
function ContentTypeModal({ handleClose, modal }: { handleClose: () => void, modal: boolean }) {
  return (
    <Modal open={modal} handleClose={handleClose}>
      <Card>
        <Card.Header>Create a New Content Type</Card.Header>
        <Card.Body>
          <NewContentTypeForm/>
        </Card.Body>
      </Card>
    </Modal>
  );
}

/**
 * Renders the details of a ruleset
 * @param ruleset The ruleset to describe in this page
 */
function RulesetPage({
  contentTypes,
  contentTypeCount,
  ruleset,
}: RulesetPageProps): JSX.Element {
  if (ruleset === undefined) { return <Page><Error statusCode={404}/></Page>; }

  const [ contentTypeModal, setContentTypeModal ] = React.useState(false); // Boolean for rendering the modal
  function handleContentTypeClose() { setContentTypeModal(false); } // Handles closing the modal

  /**
   * The function to fetch new content types
   * @param filters The filters for the data to fetch
   * @param limit The maximum number of documents to return
   * @param skip The total number of documents to skip before returning
   * @param sort The key to sort by
   */
  async function fetchContentTypes(
    filters: Record<string, unknown>,
    limit: number,
    skip: number,
    sort: string
  ): Promise<any> {
    const res = await rest.post<FetchContentTypeData>(
      `/api/ruleset/${ruleset._id}/content-types`,
      {
        filters,
        options: { limit, skip, sort },
      }
    );
    return { content: res.data.contentTypes, count: 0 };
  }

  return (
    <Page>
      <Breadcrumbs titles={["Home", "Rulesets", ruleset.name]}/>
      <h1>{ruleset.name}</h1>

      <h2>
        Content Types
        <button className="btn btn-primary" style={{float: "right"}} onClick={() => { setContentTypeModal(true); }}>
          Create
        </button>
      </h2>
      <ContentTypeModal modal={contentTypeModal} handleClose={handleContentTypeClose}/>
      <IndexTable
        content={contentTypes}
        contentCount={contentTypeCount}
        fetchContent={fetchContentTypes}
        filters={{}}
        limit={initialContentTypeLimit}
        sort={initialContentTypeSort}
        tableBuilder={contentTypeTableBuilder}
      />
    </Page>
  );
}

RulesetPage.getInitialProps = async (ctx: NextPageContext) => {
  const res = await rest.post<any>(
    `/api/pages/rulesets/${ctx.query.id}`,
    {
      contentType: {
        filters: {},
        options: {
          limit: initialContentTypeLimit,
          sort: initialContentTypeSort,
        },
      },
    }
  );
  return {
    contentTypes: res.data.contentTypes,
    contentTypeCount: res.data.contentTypeCount,
    ruleset: res.data.ruleset || undefined,
  };
};

export default RulesetPage;