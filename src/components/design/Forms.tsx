import {
  FormControl,
  Grid,
  Input as MuiInput,
  InputLabel,
} from "@material-ui/core";
import react, { Dispatch, SetStateAction } from "react";
import { def } from "../../helpers/common";

interface IForm {
  children?: any; // The contents to place within the form
}

interface IInput {
  id: string; // The input 'id' content
  name?: string; // The name of the input
  label?: string; // The label to display as
  color?: "primary" | "secondary"; // The color of the input
  defaultValue?: string; // The default value to start with (if given no value)
  disabled?: boolean; // If an input is disabled or not
  onChange?: (event: object) => void; // The event that occurs on change
  placeholder?: string; // A placeholder value for when the input is empty
  required?: boolean; // If this is required or not
  type?: string; // The 
  value?: string; // The value of the input
  ariaDescribedBy?: string; // Readability setting
}

/**
 * Renders the outside of a form
 * @param props see IForm
 */
export function Form(props: IForm) {
  const children: JSX.Element[] = [];
  const [data, setData] = react.useState({name: ""});

  /**
   * Gets the value for a specific input
   * @param name The name of the field to pull data from
   */
  function getValue(name: string) {
    return (data as any)[name];
  }

  /**
   * The function to run when an input changes
   * @param event The change event that occurs on change
   */
  function onChange(event: any) {
    setFormData(event.target.name, event.target.value);
  }

  /**
   * A general function to set form data
   * @param name The key to write the data to
   * @param value The value to write
   */
  function setFormData(name: string, value: string) {
    const newData: any = {...data};

    newData[name] = value;
    setData(newData);
  }

  // Clones and alters the children of this Form to 
  react.Children.toArray(props.children).forEach((child: JSX.Element) => {
    const newChildName = def<string>(child.props.name, child.props.id);

    const newChild = react.cloneElement(child, {
      name: newChildName,
      onChange: (event: any) => { onChange(event); },
      value: getValue(newChildName),
    });

    // Ensure this field exists in the data before render
    if (getValue(newChildName) === undefined) {
      setFormData(newChildName, "");
    }

    children.push(newChild);
  });

  return (
    <form noValidate>
      <Grid container spacing={2}>
        {children}
      </Grid>
    </form>
  );
}

/**
 * Renders out a grid-based input block
 * @param props see IInput
 */
export function Input(props: IInput) {
  const name = def<string>(props.name, props.id);
  const label = def<string>(props.label, name);
  const disabled = def<boolean>(props.disabled, false);

  return (
    <Grid item sm={6} xs={12}>
      <FormControl>
        <InputLabel html-for={props.id}>{label}</InputLabel>
        <MuiInput
          id={props.id}
          name={name}

          aria-describedby={props.ariaDescribedBy}
          color={props.color}
          disabled={disabled}
          // TODO - error
          onChange={props.onChange}
          fullWidth={true}
          placeholder={props.placeholder}
          required={props.required}
          type={props.type}
          value={props.value}
        />
      </FormControl>
    </Grid>
  );
}
