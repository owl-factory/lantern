import React from "react";
import renderer from "react-test-renderer";
import Tooltip from "../../../components/design/Tooltip";

describe('renders Tooltip', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Tooltip title="Test Tooltip"><b>Hover Me!</b></Tooltip>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  });
});
