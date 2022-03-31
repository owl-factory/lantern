import { isValidCollection, isValidRef } from "../../../helpers/fields";

(isValidRef as any).mockImplementation((_ref: unknown) => {
  return true;
});

(isValidCollection as any).mockImplementation((_ref: unknown, _expectedCollection?: string) => true);
