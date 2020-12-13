import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from "enzyme";
import React from "react";
import renderer from "react-test-renderer";
import Pagination, { PageState } from "../../../components/design/Pagination";

configure({adapter: new Adapter()});

describe('renders Pagination', () => {
  it('renders correctly', () => {
    const pageState: PageState = { page: 3, perPage: 25, totalCount: 125 };
    const setPageState = (pageState: PageState) => {return;}
    const tree = renderer.create(
      <Pagination pageState={pageState} setPageState={setPageState}/>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  });

  it('switches pages', () => {
    const pageState: PageState = { page: 3, perPage: 25, totalCount: 125 };
    const setPageState = jest.fn();

    const pagination = mount(
      <Pagination pageState={pageState} setPageState={setPageState}/>
    );
    
    pagination.find("a").first().simulate("click");
    expect(setPageState.mock.calls.length).toEqual(1);

  });

  it('on first page', () => {
    const pageState: PageState = { page: 1, perPage: 25, totalCount: 125 };
    const setPageState = (pageState: PageState) => {return;}
    const tree = renderer.create(
      <Pagination pageState={pageState} setPageState={setPageState}/>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  });

  it('on last page', () => {
    const pageState: PageState = { page: 6, perPage: 25, totalCount: 125 };
    const setPageState = (pageState: PageState) => {return;}
    const tree = renderer.create(
      <Pagination pageState={pageState} setPageState={setPageState}/>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  });

  it('handles negative perPage', () => {
    const pageState: PageState = { page: 1, perPage: -25, totalCount: 3 };
    const setPageState = (pageState: PageState) => {return;}
    const tree = renderer.create(
      <Pagination pageState={pageState} setPageState={setPageState}/>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  });
});
