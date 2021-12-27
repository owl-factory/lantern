import { RulesetController, RulesetManager } from "controllers/data/ruleset";
import { Page } from "components/design";
import { Button, ButtonGroup, Col, Loading } from "components/style";
import { Input } from "components/style/forms";
import { Modal } from "components/style/modals";
import { Tooltip } from "components/style/tooltips";
import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Card, Row, Table } from "react-bootstrap";
import { MdLockOpen, MdLockOutline, MdPageview, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { isAdmin } from "server/logic/security";
import { InitialProps } from "types/client";
import { RulesetDocument, UserDocument } from "types/documents";
import { getSession } from "utilities/auth";
import { rest } from "utilities/request";
import { RulesetCache } from "controllers/cache/RulesetCache";

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

  RulesetCache.set(result.data.ruleset);
  return;
}

interface RulesetOwnerProps {
  ownedBy?: Partial<UserDocument>;
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
              <Button onClick={() => RulesetController.updateIsPublic(props.ruleset.ref as string, false)}>
                <Tooltip title="Make Private"><MdVisibilityOff/></Tooltip>
              </Button>
            ) : (
              <Button onClick={() => RulesetController.updateIsPublic(props.ruleset.ref as string, true)}>
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
  const [ rulesets, setRulesets ] = React.useState<Partial<RulesetDocument>>([]);
  const [ modal, setModal ] = React.useState(false);

  function closeModal() { setModal(false); }

  const rulesetRows: JSX.Element[] = [];

  React.useEffect(() => {
    RulesetCache.setMany(props.rulesets);
  }, []);

  React.useEffect(() => {
    setRulesets(RulesetCache.getPage());
  }, [RulesetCache]);

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

interface AdminRulesetResult {
  rulesets: RulesetDocument[];
}

AdminRulesets.getInitialProps = (async (ctx: NextPageContext) => {
  const session = getSession(ctx);
  if (!session || !isAdmin(session.user)) { return {
    success: false,
    message: "You must be an admin to view this page.",
    session: session,
    rulesets: [],
  }; }

  const result = await rest.get<AdminRulesetResult>(`/api/admin/rulesets`);
  return {
    session,
    success: result.success,
    message: result.message,
    rulesets: result.data.rulesets,
  };
});

export default observer(AdminRulesets);
