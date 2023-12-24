import * as Yup from "yup";

/**
 * Validates form values against a Yup schema
 * @param formValues The raw form values to validate
 * @param schema The Yup Schema to use for validation
 * @returns The transformed form values
 * @throws An object with form value keys and any errors encountered for them
 */
export function validate(formValues: Record<string, unknown>, schema: Yup.AnyObjectSchema) {
  return schema.validateSync(formValues);
}
