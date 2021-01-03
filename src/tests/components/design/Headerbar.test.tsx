import React from "react";
import renderer from "react-test-renderer";
import HeaderBar from "../../../components/design/HeaderBar";

describe('Render Headerbar', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HeaderBar/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

