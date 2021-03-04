import { Form, Formik } from "formik";
import React from "react";
import { Table } from "react-bootstrap";
import { MdBlock, MdBuild } from "react-icons/md";
import { Col, ContextMenu, Row } from "../..";
import { fieldTypes, FieldTypeEnum } from "../../../types";
import { ContextMenuBuilder } from "../../../utilities";
import { FloatingLabel, Input, Select } from "../../design";

// TODO
type FieldType = any;

// The props for the Fields tool
interface FieldsProps {
  fields: Record<string, FieldType>;
  setFields: (fields: Record<string, FieldType>) => void;
}

/**
 * Renders the Fields tool for creating and editing fields
 * @param props.fields The object of fields to render
 * @param props.setFields The function to update the fields object
 */
export function Fields(props: FieldsProps): JSX.Element {
  const [ activeField, setActiveField ] = React.useState("");

  /**
   * Sets the new active field for editing
   * @param key The field key to edit
   */
  function setActive(key: string) {
    setActiveField(key);
  }

  function cleanRestrictedFields() {
    const newFields = {...props.fields};
    let touched = false;

    // TODO - make a loop if 2+
    if ("__new__" in newFields) { delete newFields["__new__"]; touched = true; }
    if (touched) { props.setFields(newFields); }
  }

  function cancelField() {
    cleanRestrictedFields();
    setActive("");
  }

  /**
   * Deletes an item from the fields object
   * @param key The key to delete from the fields object
   */
  function deleteField(key: string) {
    if (!(key in props.fields)) {
      console.warn(`The key '${key}' does not exist. No change made.`);
      return;
    }

    const newFields = {...props.fields};
    delete newFields[key];
    props.setFields(newFields);
    return;
  }

  /**
   * Adds a new field to the object
   */
  function newField() {
    const newFields = {
      ...props.fields,
      __new__: { name: "", key: "", type: 0 },
    };

    props.setFields(newFields);
    setActiveField("__new__");
  }

  /**
   * Updates a single field within the fields object. Deletes an old key if different
   * @param values The values of the field to update within the fields object
   */
  function updateField(values: FieldType) {
    const newFields = {...props.fields};

    // Ensures we don't have leftover data
    if (values.key !== activeField) { delete newFields[activeField as string]; }

    newFields[values.key] = values;
    props.setFields(newFields);
    setActive("");
  }

  // Adds actions for the table builder
  const fieldActions = new ContextMenuBuilder()
  .addItem("Edit", MdBuild, (context: FieldType) => {setActive(context.key);})
  .addItem("Delete", MdBlock, (context: FieldType) => (deleteField(context.key)));

  function FieldListItem({ field }: { field: FieldType }) {
    return (
      <tr>
        <td>{field.key}</td>
        <td>{field.name}</td>
        <td>{fieldTypes[field.type].name}</td>
        <td>{field.readOnly ? "Yes" : "No"}</td>
        <td>
          <ContextMenu
            context={field}
            {...fieldActions.renderConfig()}
          />
        </td>
      </tr>
    );
  }

  /**
   * Renders the form to create or edit a field.
   */
  function FieldForm() {
    if (activeField === "") { return null; }
    const initialValues = props.fields[activeField];

    // TODO - need validation
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={updateField}
      >
        {() => (
          <Form>
            <FloatingLabel for="name" label="Field Name">
              <Input id="name" name="name"/>
            </FloatingLabel>
            <FloatingLabel for="key" label="Variable Key">
              <Input id="key" name="key"/>
            </FloatingLabel>
            <FloatingLabel for="type" label="Variable Type">
              <Select id="type" name="type" options={fieldTypes} labelKey="name" valueKey="value"/>
            </FloatingLabel>
            <button type="button" className="btn btn-primary" onClick={cancelField}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </Form>
        )}
      </Formik>
    );
  }

  /**
   * Renders out the list of all given fields
   */
  function FieldList() {
    const fieldListRows: JSX.Element[] = [];
    const fieldKeys = Object.keys(props.fields).sort();
    fieldKeys.forEach((fieldKey: string) => {
      const field = props.fields[fieldKey];
      fieldListRows.push(<FieldListItem key={field.key} field={field}/>);
    });

    return (
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Field Name</th>
            <th>Type</th>
            <th>Read Only?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fieldListRows}
        </tbody>
      </Table>
    );
  }

  return (
    <>
      <h2>
        Fields
        <button className="btn btn-primary float-end" onClick={newField}>
          New
        </button>
      </h2>
      <Row>
        <Col xs={12} md={8}>
          <FieldList/>
        </Col>
        <Col xs={12} md={4}>
          <FieldForm/>
        </Col>
      </Row>
    </>
  );
}
