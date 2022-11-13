import { UseToastOptions } from "@chakra-ui/react";

// Describes a standard type used for passing information along error throws and responses
export interface AlertMessage extends Partial<UseToastOptions> {
  title: string,
  description: string,
}
