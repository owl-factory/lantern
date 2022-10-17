import { UseToastOptions } from "@chakra-ui/react";

export interface AlertMessage extends Partial<UseToastOptions> {
  title: string,
  description: string,
}
