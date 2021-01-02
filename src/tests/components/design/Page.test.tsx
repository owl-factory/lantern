import React from "react";
import renderer from "react-test-renderer";
import Page from "../../../components/design/Page";

describe('renders Page', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Page>Testing</Page>).toJSON()
    expect(tree).toMatchSnapshot()
  });
});
