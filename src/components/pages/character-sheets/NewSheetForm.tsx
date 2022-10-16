import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { Alerts } from "@owl-factory/alerts";
import { Input, Select } from "@owl-factory/components/form";
import { ActorSheet } from "@prisma/client";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";

interface NewSheetFormProps {
  onCompleted: (sheet: ActorSheet) => void;
}

// The typing of the form contents and submission
interface FormValues {
  name: string;
  rulesetID: string;
}

// The initial values of the form
const INITIAL_VALUES = {
  name: "",
  rulesetID: "",
};

// Query to get all available rulesets
const GET_AVAILABLE_RULESETS = gql`
  query Rulesets($include: RulesetInclude) {
    rulesets(include: $include) {
      id, name
    }
  }
`;

// Mutation to create an actor
const CREATE_SHEET = gql`
  mutation CreateActorSheet($actorSheet: ActorSheetCreateInput!) {
    createActorSheet(actorSheet: $actorSheet) {
      id, name, rulesetID
    }
  }
`;

/**
 * Renders a form for creating a new character
 * @param onCompleted The function to run on the successful completion of the submission
 */
export function NewSheetForm(props: NewSheetFormProps) {
  const rulesetQuery = useQuery(GET_AVAILABLE_RULESETS);
  const [ createSheet ]  = useMutation(CREATE_SHEET);

  let rulesetOptions: JSX.Element[] = [];

  if (rulesetQuery.loading || rulesetQuery.error) {
    rulesetOptions = [];
  }
  else {
    for (const ruleset of rulesetQuery.data.rulesets) {
      rulesetOptions.push(<option key={ruleset.id} value={ruleset.id}>{ruleset.name}</option>);
    }
  }

  /**
   * Handles any functionality that needs to run after the successful creation of the actor sheet
   * @param data The data returned by the successful actor sheet creation
   */
  function onCompleted(data: { createActorSheet: ActorSheet }) {
    props.onCompleted(data.createActorSheet);
  }

  /**
   * Handles the case where the actor sheet fails to create
   * @param error The error returned by Apollo
   */
  function onError(error: ApolloError) {
    console.error(error);
    Alerts.error({ title: `The character could not be created` });
  }

  /**
   * Handles the submission, validation, and creation of a new actor sheet
   * @param values The name and ruleset to create as an actor sheet
   * @param formik Helper functions
   */
  function onSubmit(values: FormValues, formik: FormikHelpers<FormValues>) {
    createSheet({
      variables: {
        actorSheet: {
          name: values.name,
          rulesetID: values.rulesetID,
        },
      },
      refetchQueries: ["GetMyCharacterSheets"],
      onCompleted,
      onError,
    });
  }

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={onSubmit}
    >
      {() => (
        <Form id="createNewCharacterSheetForm">
          <label>Name</label>
          <Input type="text" name="name"/>

          <label>Ruleset</label>
          <Select name="rulesetID">
            <option value="">-- Select a Ruleset --</option>
            { rulesetOptions }
          </Select>
        </Form>
      )}
    </Formik>
  );
}
