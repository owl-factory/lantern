import { Page } from "components/design";
import { XMLRender } from "nodes/xmlrender/v1/XMLRender";
import React from "react";
import { ElementType } from "types/enums/xml/elementType";
import { NullXMLEngineAPI } from "types/interfaces/XMLEngineAPI";

class TestXMLEngineAPI extends NullXMLEngineAPI {
  getLayout() {
    return [
      {type: ElementType.Box, children: [
        {type: ElementType.Input, children: []},
        {type: ElementType.Input, children: []},
      ]},
    ];
  }
}
export function XMLRenderDevelopmentPage() {
  const engine = new TestXMLEngineAPI();

  return (
    <Page>
      <XMLRender engine={engine} />
    </Page>
  );
}

export default XMLRenderDevelopmentPage;
