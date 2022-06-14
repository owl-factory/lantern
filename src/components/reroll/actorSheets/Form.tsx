import { Button } from "@owl-factory/components/button";
import { Input } from "@owl-factory/components/form";
import { TextArea } from "@owl-factory/components/form/TextArea";
import { Ref64 } from "@owl-factory/types";
import { ActorSheet } from "components/sheets/ActorSheet";
import { ActorSheetData } from "controllers/data/ActorSheetData";
import { Formik, FormikProps } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { ActorSheetDocument } from "types/documents/ActorSheet";

// The initial values for the form if no actor sheet is given
const INITIAL_VALUES = {
  name: "",
  xml: "",
}

interface ActorSheetFormProps {
  actorSheet?: Partial<ActorSheetDocument>;
  ruleset: Ref64;
  onSubmit: (actorSheet: Partial<ActorSheetDocument>) => void;
}

/**
 * Renders a form for editing an actor sheet using the XML text area
 * @param actorSheet The actor sheet currently being edited, if any. Null if creating a new sheet
 * @param ruleset The ref of the current ruleset this sheet belongs to
 * @param onSubmit The function to call when the form is submitted
 */
export const ActorSheetForm = observer((props: ActorSheetFormProps) => {
  const initialValues = props.actorSheet ? props.actorSheet : INITIAL_VALUES;
  const id = "temp";

  // Ensures that the actor sheet XML is loaded into the preview
  React.useEffect(() => {
    ActorSheetData.unloadSheet(id);
    if (props.actorSheet && props.actorSheet.xml) {
      ActorSheetData.loadSheet(id, props.actorSheet.xml);
    }
  }, [props.actorSheet])

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={props.onSubmit}
      >
        {
          (formikProps: FormikProps<Partial<ActorSheetDocument>>) => {
            /**
             * Refreshes the XML preview based on the contents of the XML
             */
            function refresh() {
              ActorSheetData.loadSheet(id, formikProps.values.xml || "");
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
            )
          }
        }
      </Formik>
      <hr/>
      <ActorSheet id={id}/>
    </div>
  )
});
