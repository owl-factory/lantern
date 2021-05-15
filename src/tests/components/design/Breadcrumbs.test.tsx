import React from "react";
import renderer from "react-test-renderer";
import Breadcrumbs from "components/design/Breadcrumbs";
import { WithTestRouter } from "utilities/tests/WithTestRouter";

const push = jest.fn();

describe('Breadcrumb rendering', () => {
  it('renders correctly with an admin path', () => {
    const router = {
      push,
      pathname: "/admin/game-systems/[gameSystemAlias]/modules/[moduleAlias]",
      asPath: "/admin/game-systems/dnd-5e/modules/srd",
    };
    const tree = renderer.create(
      <WithTestRouter router={router}>
        <Breadcrumbs
          skipLevels={1}
          titles={["Game Systems", "Dungeons & Dragons, 5e", "Modules", "SRD"]}
        />
      </WithTestRouter>
    ).toJSON();


    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with no arguments', () => {
    const router = {
      push,
      pathname: "/admin/game-systems/[gameSystemAlias]/modules/[moduleAlias]",
      asPath: "/admin/game-systems/dnd-5e/modules/srd",
    };
    const tree = renderer.create(
      <WithTestRouter router={router}>
        <Breadcrumbs />
      </WithTestRouter>
    ).toJSON();


    expect(tree).toMatchSnapshot();
  });
});

