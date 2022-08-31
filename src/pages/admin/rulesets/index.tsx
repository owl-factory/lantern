import { Page } from "components/design";
import { Button, ButtonGroup } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { Modal } from "@owl-factory/components/modal";
import { Tooltip } from "@owl-factory/components/tooltip";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Card, Row, Table } from "react-bootstrap";
import { MdLockOpen, MdLockOutline, MdPageview, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { InitialProps } from "types/client";
import { RulesetDocument, UserDocument } from "types/documents";
import { getSession } from "@owl-factory/auth";
import { rest } from "@owl-factory/https";
import { RulesetData } from "controllers/data/RulesetData";
import { Col } from "@owl-factory/components/flex";
import { Loading } from "@owl-factory/components/loading";
import { getAdminRulesets } from "src/pages/api/admin/rulesets";
import { handleAPI } from "@owl-factory/https";
import { Ref64 } from "@owl-factory/types";

interface AdminRulesetsProps extends InitialProps {
  rulesets: RulesetDocument[];
}


interface RulesetUpdateResponse {
  ruleset: RulesetDocument;
}

/**
 * Updates a ruleset to a new public state.
 * @param id The ID of the ruleset to update
 * @param isPublic The new isPublic value
 */
async function setPublic(id: string, isPublic: boolean) {
  const result = await rest.post<RulesetUpdateResponse>(`/api/rulesets/${id}/public`, { isPublic });
  if (!result.success) {
    // TODO - error handling/display
    return;
  }

  RulesetData.set(result.data.ruleset);
  return;
}

interface RulesetOwnerProps {
  ownedBy?: Partial<UserDocument> | any;
}

/**
 * Renders the owner of a ruleset
 * @param ownedBy The owner of a ruleset (if any)
 * @returns Returns a JSX element with the name of the owner, a loading circle, or nothing if there is no owner
 */
function RulesetOwner(props: RulesetOwnerProps) {
  if (!props.ownedBy) { return <></>; }

  const name = undefined;
  return <>{name || <Loading/>}</>;
}


/**
 * Renders the form to create a new game system.
 */
 function CreateRulesetForm() {
  const router = useRouter();

  /**
   * Runs the submit action of the create game system form and handles
   * the success and failure results
   *
   * @param values The values from the form to submit
   */
  async function onSubmit(values: Record<string, string | boolean>) {
    values.isOfficial = true;
    const response = await rest.put<{ ruleset: RulesetDocument }>(
      "/api/rulesets",
      values
    );
    if (!response.success) {
      // TODO - error handling
      return;
    }

    const href = `/admin/rulesets/${response.data.ruleset.ref}`;
    router.push(href);
  }

  return (
    <Formik
      initialErrors={ {} }
      initialValues={ { name: "" } }
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          {/* Just name for now */}
          <Row>
            <Col xs={12} lg={6}>
              <label>Ruleset Name</label>
              <Input type="text" name="name"/>
              {/* <ErrorMessage name="name"/> */}
            </Col>
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
 function RulesetModal({ handleClose, modal }: { handleClose: () => void, modal: boolean }) {
  return (
    <Modal open={modal} handleClose={handleClose}>
      <Card>
        <Card.Header>Create a New Ruleset</Card.Header>
        <Card.Body>
          <CreateRulesetForm/>
        </Card.Body>
      </Card>
    </Modal>
  );
}

interface RulesetRowProps {
  index: number;
  ruleset: Partial<RulesetDocument>;
}

function updateIsPublic(ref: Ref64, isPublic: boolean) {
  return;
}

/**
 * Renders a single row for describing a ruleset
 * @param index The current index of the row
 * @param ruleset The current ruleset to render information for
 */
const RulesetRow = observer((props: RulesetRowProps) => {
  return (
    <tr>
      <td>{props.index}</td>
      <td>{props.ruleset.name}</td>
      <td>
        <RulesetOwner ownedBy={props.ruleset.ownedBy}/>
      </td>
      <td>
        {
          props.ruleset.isPublic ?
          <Tooltip title="Public"><MdVisibility/></Tooltip> :
          <Tooltip title="Private"><MdVisibilityOff/></Tooltip>
        }
        {
          props.ruleset.isLocked ?
          <Tooltip title="Locked"><MdLockOutline/></Tooltip> :
          <Tooltip title="Unlocked"><MdLockOpen/></Tooltip>
        }
      </td>
      <td>
        <ButtonGroup>
          <Link href={`/admin/rulesets/${props.ruleset.ref}`} passHref>
            <Button><Tooltip title="View"><MdPageview/></Tooltip></Button>
          </Link>
          {
            props.ruleset.isPublic ? (
              <Button onClick={() => updateIsPublic(props.ruleset.ref as string, false)}>
                <Tooltip title="Make Private"><MdVisibilityOff/></Tooltip>
              </Button>
            ) : (
              <Button onClick={() => updateIsPublic(props.ruleset.ref as string, true)}>
                <Tooltip title="Make Public"><MdVisibility/></Tooltip>
              </Button>
            )
          }
          {
            props.ruleset.isLocked ?
            <Button>
              <Tooltip title="Unlock"><MdLockOpen/></Tooltip>
            </Button> :
            <Button>
              <Tooltip title="Lock"><MdLockOutline/></Tooltip>
            </Button>
          }
        </ButtonGroup>
      </td>
    </tr>
  );
});

/**
 * Renders a page for administrators to review Rulesets
 * @param success Whether or not the initial props failed
 * @param message The success or error message indicating the error from the intial props
 * @param session The current user's session
 * @param rulesets The initial light ruleset information fetched from the API
 */
function AdminRulesets(props: AdminRulesetsProps) {
  const [ rulesets, setRulesets ] = React.useState<Partial<RulesetDocument>[]>([]);
  const [ modal, setModal ] = React.useState(false);

  function closeModal() { setModal(false); }

  const rulesetRows: JSX.Element[] = [];

  React.useEffect(() => {
    RulesetData.setMany(props.rulesets);
  }, []);

  React.useEffect(() => {
    const rulesetRefs = RulesetData.search({ group: "data" });
    setRulesets(RulesetData.getMany(rulesetRefs));
  }, [RulesetData]);

  rulesets.forEach((ruleset: Partial<RulesetDocument>, index: number) => {
    rulesetRows.push(<RulesetRow key={ruleset.ref} index={index + 1} ruleset={ruleset}/>);
  });

  // TODO - single liner for ensuring admin
  return (
    <Page>
      <h1>Rulesets</h1>
      <Button onClick={()=>setModal(true)}>Create</Button>
      <Table>
        <thead>
          <tr>
            <th>
              {/* Number? */}
            </th>
            <th>Ruleset</th>
            <th>Owned By</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rulesetRows}
        </tbody>
      </Table>
      <RulesetModal handleClose={closeModal} modal={modal}/>
    </Page>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  return await handleAPI(ctx, getAdminRulesets);
}

export default observer(AdminRulesets);
