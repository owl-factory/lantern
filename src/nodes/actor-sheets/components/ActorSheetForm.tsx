import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { TextArea } from "@owl-factory/components/form/TextArea";
import { Ref64 } from "@owl-factory/types";
import { ActorSheet } from "@prisma/client";
import { Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets";
import React from "react";
import { ActorSheetComponent } from "src/nodes/actor-sheets/components/ActorSheet";
import { ActorSheetDocument } from "types/documents/ActorSheet";

// The initial values for the form if no actor sheet is given
const INITIAL_VALUES = {
  name: "",
  xml: "",
};

interface ActorSheetFormProps {
  renderID: string;
  actorSheet?: ActorSheet;
  ruleset: Ref64;
  onSubmit: (actorSheet: Partial<ActorSheet>) => void;
}

/**
 * Renders a form for editing an actor sheet using the XML text area
 * @param renderID The id of the render used for this
 * @param actorSheet The actor sheet currently being edited, if any. Null if creating a new sheet
 * @param ruleset The ref of the current ruleset this sheet belongs to
 * @param onSubmit The function to call when the form is submitted
 */
export const ActorSheetForm = observer((props: ActorSheetFormProps) => {
  const initialValues = props.actorSheet ? props.actorSheet : INITIAL_VALUES;

  // Ensures that the actor sheet XML is loaded into the preview
  React.useEffect(() => {
    ActorController.unloadSheet("development-sheet");
    if (props.actorSheet) {
      ActorController.loadSheet("development-sheet", props.actorSheet);
    }
  }, [props.actorSheet]);

  // Try/Catch block prevents issues within the actor sheet preventing updating of the XML
  let actorSheet;
  try { actorSheet = <ActorSheetComponent id={props.renderID}/>; }
  catch (e) { actorSheet = <>{e}</>; }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={props.onSubmit}
      >
        {
          (formikProps: FormikProps<Partial<ActorSheet>>) => {
            /**
             * Refreshes the XML preview based on the contents of the XML
             */
            function refresh() {
              // ActorController.loadSheet("development-sheet", { layout: formikProps.values.xml});
            }

            return (
              <>
                <label htmlFor="name">Name</label>
                <Input type="text" id="name" name="name"/>
                <label htmlFor="XML Input">XML&nbsp;</label>
                <TextArea name="xml" rows={10}/><br/>
                <Button onClick={refresh}>Refresh</Button><br/><br/>
                <Button type="submit" onClick={formikProps.submitForm}>Submit</Button>
              </>
            );
          }
        }
      </Formik>
      <hr/>
      {actorSheet}
    </div>
  );
});
