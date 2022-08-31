import { clear, remove, set, setRefs } from "../../controllers/functionality/caching";
import { Ref64 } from "@owl-factory/types";

(clear as any).mockImplementation((_collection: string) => { return; });
(remove as any).mockImplementation((collection: string, _ref: Ref64) => {
  if (collection === "success") { return 1; }
  return 0;
});
(set as any).mockImplementation((_collection: string, _ref: Ref64) => { return; });
(setRefs as any).mockImplementation((_collection: string, _refs: Ref64[]) => { return; });
