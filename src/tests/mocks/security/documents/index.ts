import { isOwner } from "security/documents";
import { AnyDocument } from "types/documents";

(isOwner as any).mockImplementation((_doc: AnyDocument) => false);
