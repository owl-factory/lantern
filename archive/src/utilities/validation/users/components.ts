import * as Yup from "yup";

export const usernameValidation = Yup.string()
  .required("Required")
  .min(3, "Must be at least 3 characters long")
  .max(64, "Must be fewer than 64 characters long");

export const passwordValidation =  Yup.string()
  .required("Required")
  .min(6, "Must be at least six characters long")
  .max(64, "Must be less than 64 characters");
