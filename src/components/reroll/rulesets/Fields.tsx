import { Form, Formik } from "formik";
import React from "react";
import { Table } from "react-bootstrap";
import { MdBlock, MdBuild } from "react-icons/md";
import { Col, ContextMenu, Row } from "../..";
import { ContextMenuBuilder } from "../../../utilities";
import { Input } from "../../design";

type FieldType = any;

// The props for the Fields tool
interface FieldsProps {
  fields: Record<string, FieldType>;
  setFields: (fields: Record<string, FieldType>) => void;
}

export function Fields(props: FieldsProps): JSX.Element {
  const [ activeField, setActiveField ] = React.useState("");

  /**
   * Sets the new active field for editing
   * @param key The field key to edit
   */
  function setActive(key: string) {
    setActiveField(key);
  }

  function deleteField(key: string) {
    const newFields = {...props.fields};
    delete newFields[key];
    props.setFields(newFields);
    return;
  }

  function newField() {
    const newFields = {
      ...props.fields,
      __new__: { name: "", key: "", type: 0 }
    };

    props.setFields(newFields);
    setActiveField("__new__");
  }

  function updateField(values: FieldType) {
    const newFields = {...props.fields};
    if (values.key !== activeField) { delete newFields[activeField as string]; }

    newFields[values.key] = values;
    props.setFields(newFields);
    setActive("");

    return;
  }

  // Adds actions for the table builder
  const fieldActions = new ContextMenuBuilder()
  .addItem("Edit", MdBuild, (context: any) => {setActive(context.key)})
  .addItem("Delete", MdBlock, (context: any) => (deleteField(context.key))); 

  function FieldListItem({ field }) {
    return (
      <tr>
        <td>{field.key}</td>
        <td>{field.name}</td>
        <td>{field.type}</td>
        <td>
          <ContextMenu
            context={field}
            {...fieldActions.renderConfig()}
          />
        </td>
      </tr>
    );
  }

  function FieldForm() {
    if (activeField === "") { return null; }
    const initialValues = props.fields[activeField];

    return (
      <Formik
        initialValues={initialValues}
        onSubmit={updateField}
      >
        {() => (
          <Form>
            <Input name="name"/>
            <Input name="key"/>
            <button type="submit" className="btn btn-primary">Save</button>
          </Form>
        )}
      </Formik>
    );
  }

  function FieldList() {
    const fieldListRows: any = [];
    const fieldKeys = Object.keys(props.fields).sort();
    fieldKeys.forEach((fieldKey: string) => {
      const field = props.fields[fieldKey];
      fieldListRows.push(<FieldListItem field={field}/>);
    });

    return (
      <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Field Name</th>
            <th>Type</th>
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
        <button className="btn btn-primary float-right" onClick={newField}>
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
