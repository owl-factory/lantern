import React from "react";
import { Form, Col, Button } from "react-bootstrap";
import { Error, Input, Multiselect } from "../design/forms/Forms";
import { AtomType, Display, RenderError } from "./Layouts";

function renderDisplayClasses(display?: Display) {
  let classString = " ";
  if (display === undefined) { return classString; }
  if (display.xs) { classString += `d-${display.xs} `; }
  if (display.sm) { classString += `d-sm-${display.sm} `; }
  if (display.md) { classString += `d-md-${display.md} `; }
  if (display.lg) { classString += `d-lg-${display.lg} `; }
  if (display.xl) { classString += `d-xl-${display.xl} `; }
  return classString;
}

function TextInput(props: any) {
  let errors: string = "";
  const inputName = props.atom.staticValues.inputName || undefined;
  const label = props.atom.staticValues.label || undefined;
  const placeholder = props.atom.staticValues.placeholder || undefined;
  
  if (!inputName) { errors += "An input name is required."; }

  if (errors) { return <RenderError w={props.atom.w} errors={errors}/>; }

  return (
    <Form.Group as={Col} {...(props.atom.w || {})}>
      { label ? <Form.Label>{label}</Form.Label> : null }
      <Input 
        name={inputName} 
        placeholder={placeholder}
      />
      <Error name={inputName} />
      
    </Form.Group>
  );
}

function MultiselectInput(props: any) {
  let errors: string = "";
  const classes = renderDisplayClasses(props.atom.display);
  const inputName = props.atom.staticValues.inputName || undefined;
  const label = props.atom.staticValues.label || undefined;
  const placeholder = props.atom.staticValues.placeholder || undefined;
  
  if (!inputName) { errors += "An input name is required."; }

  if (errors) { return <RenderError w={props.atom.w} errors={errors}/>; }

  return (
    <Form.Group as={Col} className={classes} {...(props.atom.w || {})}>
      { label ? <Form.Label>{label}</Form.Label> : null }
      <Multiselect name={inputName} emptyText={placeholder}/>
    </Form.Group>
  );
}

function Submit(props: any) {
  const buttonText = props.atom.staticValues.label || undefined;
  const classes = renderDisplayClasses(props.atom.display);

  return (
    <Col className={classes} {...(props.atom.w || {})}>
      <Button type="submit">{buttonText}</Button>
    </Col>
  )
}


export function DynamicAtom(props: any): JSX.Element {
  try {
    switch(props.atom.type) {
      // case "checkbox":
      //   return <input type="checkbox"/>;
      case AtomType.TextInput:
        return <TextInput atom={props.atom}/>;
      case AtomType.MultiselectInput:
        return <MultiselectInput atom={props.atom}/>;
      case AtomType.Submit:
        return <Submit atom={props.atom}/>;
      // case "numberInput":
      //   return <input type="number" style={props.component.style} />;
      // case "text":
      //   return <div>{props.component.value}</div>
    }
  } catch (error) {
    // Last ditch error catch to prevent the whole sheet from crashing
    return <RenderError w={props.atom.w} errors={error.message}/>
  }
  return <></>;
}
