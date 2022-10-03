import { Button } from "@chakra-ui/react";
import { Input } from "@owl-factory/components/form";
import { TextArea } from "@owl-factory/components/form/TextArea";
import { ActorSheet, Ruleset } from "@prisma/client";
import { Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import { ActorController } from "nodes/actor-sheets";
import React from "react";
import { ActorSheetComponent } from "src/nodes/actor-sheets/components/ActorSheet";

// The initial values for the form if no actor sheet is given
const INITIAL_VALUES = {
  name: "",
  xml: "",
};

interface ActorSheetFormProps {
  renderID: string;
  actorSheet?: ActorSheet;
  ruleset: Ruleset;
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
  const renderID = "development-sheet";
  const sheetID = props.actorSheet?.id || "new-sheet";

  // Ensures that the render is loaded and unloaded
  React.useEffect(() => {
    ActorController.newRender(null, props.ruleset.id, sheetID);
    return () => ActorController.endRender(renderID);
  }, []);

  // Ensures that the actor sheet XML is loaded into the preview
  React.useEffect(() => {
    ActorController.unloadSheet(sheetID);
    if (props.actorSheet) {
      ActorController.loadSheet(sheetID, props.actorSheet);
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
              ActorController.loadSheet(sheetID, { layout: formikProps.values.layout });
            }

            return (
              <>
                <label htmlFor="name">Name</label>
                <Input type="text" id="name" name="name"/>
                <label htmlFor="layout">Layout&nbsp;</label>
                <TextArea name="layout" rows={10}/><br/>
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
