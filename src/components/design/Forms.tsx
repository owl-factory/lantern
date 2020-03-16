import {
  FormControl,
  Grid,
  Input as MuiInput,
  InputLabel,
} from "@material-ui/core";
import { def } from "../../helpers/common";

interface IForm {
  children?: any;
}

/**
 * Renders the outside of a form
 * @param props see IForm
 */
export function Form(props: IForm) {
  return (
    <form noValidate>
      <Grid container spacing={2}>
        {props.children}
      </Grid>
    </form>
  );
}

interface IInput {
  id: string;
  name?: string;
  label?: string;
  color?: "primary" | "secondary";
  disabled?: boolean;
  onChange?: (event: object) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  value: any;

  ariaDescribedBy?: string;
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
          fullWidth={true}
          onChange={props.onChange}
          placeholder={props.placeholder}
          required={props.required}
          type={props.type}
          value={props.value}
        />
      </FormControl>
    </Grid>
  );
}
