import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { AlertController } from "@owl-factory/alerts";
import { Select } from "@owl-factory/components/form";
import { Actor, ActorType, Ruleset } from "@prisma/client";
import { Form, Formik, FormikHelpers, FormikProps } from "formik";
import React from "react";

interface NewActorFormProps {
  onCompleted: (actor: Actor) => void;
}

// The typing of the form contents and submission
interface FormValues {
  rulesetID: string;
  actorTypeID: string;
}

// The initial values of the form
const INITIAL_VALUES = {
  rulesetID: "",
  actorTypeID: "",
};

// Query to get all available rulesets
const GET_AVAILABLE_RULESETS = gql`
  query Rulesets($include: RulesetInclude) {
    rulesets(include: $include) {
      id, name, actorTypes {
        id, name,
      }
    }
  }
`;

// Mutation to create an actor
const CREATE_ACTOR = gql`
  mutation CreateActor($actor: ActorCreateInput!) {
    createActor(actor: $actor) {
      id, name, rulesetID
    }
  }
`;

/**
 * Renders a form for creating a new character
 * @param onCompleted The function to run on the successful completion of the submission
 */
export function NewActorForm(props: NewActorFormProps) {
  const rulesetQuery = useQuery(GET_AVAILABLE_RULESETS, { variables: { include: { actorTypes: true }}});
  const [ createActor ]  = useMutation(CREATE_ACTOR);

  let rulesetOptions: JSX.Element[] = [];
  let actorTypeOptions: JSX.Element[] = [];

  if (rulesetQuery.loading || rulesetQuery.error) {
    rulesetOptions = [];
    actorTypeOptions = [];
  }
  else {
    for (const ruleset of rulesetQuery.data.rulesets) {
      rulesetOptions.push(<option key={ruleset.id} value={ruleset.id}>{ruleset.name}</option>);
    }
  }

  /**
   * Sets the actor type options for the currently selected ruleset
   * @param e The event triggered by changing the ruleset
   * @param formikProps The formik props for manipulating the form
   */
  function onRulesetChange(
    e: any,
    formikProps: FormikProps<FormValues>
  ) {
    if (!e) { return; }
    formikProps.setFieldValue("actorTypeID", "");
    actorTypeOptions = [];

    const rulesetID = e.target.value;
    formikProps.setFieldValue("rulesetID", rulesetID); // TODO - find a better way to handle this

    if (rulesetID === "") { return; }

    // Gets the ruleset, if any
    let ruleset: (Ruleset & { actorTypes: ActorType[] }) | undefined = undefined;
    for (const possibleRuleset of rulesetQuery.data.rulesets) {
      if (possibleRuleset.id === rulesetID) {
        ruleset = possibleRuleset;
        break;
      }
    }

    if (!ruleset) { return; }
    for (const actorType of ruleset.actorTypes) {
      actorTypeOptions.push(<option key={actorType.id} value={actorType.id}>{actorType.name}</option>);
    }
  }

  /**
   * Handles any functionality that needs to run after the successful creation of the actor
   * @param data The data returned by the successful actor creation
   */
  function onCompleted(data: { createActor: Actor }) {
    props.onCompleted(data.createActor);
  }

  /**
   * Handles the case where the actor fails to create
   * @param error The error returned by Apollo
   */
  function onError(error: ApolloError) {
    console.error(error);
    AlertController.error(`The character could not be created`);
  }

  /**
   * Handles the submission, validation, and creation of a new actor
   * @param values The ruleset and actor type to create as an actor
   * @param formik Helper functions
   */
  function onSubmit(values: FormValues, formik: FormikHelpers<FormValues>) {
    createActor({
      variables: {
        actor: {
          name: "Unnamed Actor",
          rulesetID: values.rulesetID,
          actorTypeID: values.actorTypeID,
        },
      },
      refetchQueries: ["GetMyCharacters"],
      onCompleted,
      onError,
    });
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={onSubmit}
    >
      {(formikProps: FormikProps<FormValues>) => (
        <Form id="createNewCharacterForm">

          <label>Ruleset</label>
          <Select name="rulesetID" onChange={(values: any) => onRulesetChange(values, formikProps)}>
            <option value="">-- Select a Ruleset --</option>
            { rulesetOptions }
          </Select>

          <label>Character Type</label>
          <Select name="actorTypeID">
            <option value="">-- Select a Type --</option>
            { actorTypeOptions }
          </Select>

        </Form>
      )}
    </Formik>
  );
}
