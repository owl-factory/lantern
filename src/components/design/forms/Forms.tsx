/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable react/prop-types */
/* eslint-disable no-case-declarations */
/**
 * A standard design file for all form components. The aim is to make creating and designing forms
 * as easy, simple, and flexible as possible while providing a standardized view of the form
 *
 * @TODOS
 *  - Error handling for all inputs
 *  - Classes!
 *  - Accessibility options for all
 *  - External data and state
 *  - Buttons
 */

import React from "react";
import { deepCopy, deepGet, deepSet, def, defState } from "../../../helpers/tools";
import {
  Row as BSRow 
} from "react-bootstrap";

interface FormProps {
  id?: string; // The form id. Used for creating the postfix
  children?: any; // The contents to place within the form

  data?: object;
  setData?: React.Dispatch<React.SetStateAction<any>>;

  formState?: object;
  setFormState?: React.Dispatch<React.SetStateAction<any>>;

  errors?: object;

}

export const $gridItemPropFields = ["xs", "sm", "md", "lg", "xl"];

/**
 * Grabs the default form state
 */
export function getDefaultFormState() {
  return {
    isDirty: false,
  };
}

/**
 * Determines if the error is a valid error
 *
 * @param error The error message
 */
export function $hasMessage(error: string | undefined) {
  if (error === undefined || error === "") {
    return false;
  }
  return true;
}

/**
 * Renders a message given inputs, putting precedence on the error message
 *
 * @param message The message to display, if any
 * @param error The error to display, if any
 */
export function $renderMessage(message: string | undefined, error: string | undefined) {
  if ($hasMessage(error)) {
    return error;
  } else if ($hasMessage(message)) {
    return message;
  }
}

/**
 * Renders the outside of a form
 * @param props see IForm
 */
export function AutoForm(props: FormProps) {
  const [formID] = React.useState(def<string>(props.id, "form"));
  const [data, setData] = defState<any>(props.data, props.setData, {});
  const [formState, setFormState] = defState<any>(props.formState, props.setFormState, getDefaultFormState());

  let children: JSX.Element[] = [];
  let childIndex: number = 0;

  /**
   * Gets the value for a specific input
   * @param name The name of the field to pull data from
   */
  function getValue(name: string, defaultValue: any = "") {
    // Ensures that all components are controlled even if they haven't been registered
    const result = deepGet(data, name);
    if (result === undefined) {
      return defaultValue;
    }

    return result;
  }

  /**
   * The function to run when an input changes
   * @param event The change event that occurs on change
   */
  function onChange(event: any) {
    setFormData(event.target.name, event.target.value);
  }

  /**
   * Toggles event target value
   * @param event The input onChange event
   */
  function onCheckboxChange(event: any) {
    setFormData(event.target.name, !getValue(event.target.name));
  }

  function onMultiselectChange(event: any) {
    const multiSelectArray = getValue(event.target.name, []);
    if (multiSelectArray.includes(event.target.value)) {
      multiSelectArray.splice(multiSelectArray.indexOf(event.target.value), 1);
    } else {
      multiSelectArray.push(event.target.value);
    }

    setFormData(event.target.name, multiSelectArray);
  }

  /**
   * Ensures that an input has the appropriate allocation in data
   * @param name The key to save the value under
   * @param value The value to save
   * @param defaultValue The default value to register if value is undefined
   */
  function registerValue(name: string, value: string | boolean | undefined, defaultValue: any = "" ) {
    if (getValue(name) !== undefined) {
      return;
    }

    const newValue = def<string | boolean>(value, defaultValue);
    data[name] = newValue;
    setFormData(name, newValue, false);
  }

  /**
   * Renders out children and processes them to have the correct functionality
   * @param formChildren The children to process
   */
  function renderChildren(formChildren: any) {
    const renderedChildren: JSX.Element[] = [];

    React.Children.toArray(formChildren).forEach((child: any) => {
      const childType = typeof child;

      if (childType !== "object") {
        renderedChildren.push(child);
        return;
      }

      const newChildName = def<string>(child.props.name, child.props.id);
      const keyPostfix: string = formID + "_" + childIndex++;
      const newChildProps: any = {};
      let newChild: any;
      console.log(child)

      switch (child.type.name) {
        case "Checkboxes":
          const nameKey = def<string>(child.props.nameKey, "name");
          const defaultValueKey = def<string>(child.props.defaultValueKey, "defaultValue");
          const checkboxes = def<object[]>(child.props.data, []);

          checkboxes.forEach((item: any) => {
            registerValue(item[nameKey], item[defaultValueKey], false);
          });

          newChildProps["name"] = newChildName;
          newChildProps["getValue"] = getValue;
          newChildProps["keyPostfix"] = keyPostfix;
          newChildProps["onChange"] = (event: any) => { onCheckboxChange(event); };
          newChild = React.cloneElement(child, newChildProps);
          registerValue(newChildName, child.props.defaultValue);
          break;

        case "Date":
        case "DateTime":
        case "Input":
        case "RadioButtons":
        case "Select":
        case "TextArea":
        case "Time":
          newChildProps["name"] = newChildName;
          newChildProps["keyPostfix"] = keyPostfix;
          newChildProps["value"] = getValue(newChildName);
          newChildProps["onChange"] = (event: any) => { onChange(event); };

          newChild = React.cloneElement(child, newChildProps);
          registerValue(newChildName, child.props.defaultValue);

          break;
        
        case "Multiselect":
          newChildProps["name"] = newChildName;
          newChildProps["keyPostfix"] = keyPostfix;
          newChildProps["value"] = getValue(newChildName, []);
          newChildProps["onChange"] = (event: any) => { onMultiselectChange(event); };

          newChild = React.cloneElement(child, newChildProps);
          registerValue(newChildName, child.props.defaultValue);

          break;

        // Any child of Form is recursively searched through to find any form elements 
        // that we can apply the Form to
        default:
          newChildProps["children"] = renderChildren(child.props.children);
          newChild = React.cloneElement(child, newChildProps);
      }

      renderedChildren.push(newChild);
    });
    return renderedChildren;
  }

  /**
   * A general function to set form data
   * @param name The key to write the data to
   * @param value The value to write
   */
  function setFormData(name: string, value: string | boolean, doesDirty?: boolean) {
    const newData: any = deepCopy(data);

    if (doesDirty !== false && formState.dirty === false) {
      setFormState({...formState, dirty: true});
    }

    deepSet(newData, name, value);
    setData(newData);
  }

  // Clones and alters the children of this Form
  children = renderChildren(props.children);

  return (
    <form noValidate>
      {children}
    </form>
  );
}

export { Checkboxes } from "./Checkboxes";
export { Date } from "./Date";
export { DateTime } from "./DateTime";
export { Input } from "./Input";
export { RadioButtons } from "./RadioButtons";
export { Multiselect, Select } from "./Select";
export { TextArea } from "./Textarea";
export { Time } from "./Time";