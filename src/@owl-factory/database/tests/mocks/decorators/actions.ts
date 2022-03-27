import {
  setCreateFields,
  setUpdateFields,
  trimReadFields,
  trimSetFields,
  validateDocument,
  validateDynamicAccess,
  validateLogin,
  validateStaticAccess,
} from "@owl-factory/database/decorators/actions";
import { LogicDescriptor } from "../../../decorators/types";

(validateDynamicAccess as any).mockImplementation((_descriptor: LogicDescriptor, _doc: any) => {
  return;
});

(validateStaticAccess as any).mockImplementation((_descriptor: LogicDescriptor) => {
  return;
});

(validateDocument as any).mockImplementation((_descriptor: LogicDescriptor, _doc: any) => {
  return;
});

(validateLogin as any).mockImplementation((_descriptor: LogicDescriptor) => {
  return;
});

(trimReadFields as any).mockImplementation((_descriptor: LogicDescriptor, doc: any) => { return doc; });
(trimSetFields as any).mockImplementation((_descriptor: LogicDescriptor, doc: any) => { return doc; });
(setCreateFields as any).mockImplementation((_descriptor: LogicDescriptor, doc: any) => { return doc; });
(setUpdateFields as any).mockImplementation((_descriptor: LogicDescriptor, doc: any) => { return doc; });
