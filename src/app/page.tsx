import TestComp from "components/TestComponent";

function Page() {
  return (
    <>
      <h1 className="text-green-400 text-9xl">Hello World!</h1>
      <button className="example-btn ml-2">Test Button</button>
      <br />
      <TestComp />
    </>
  );
}

export default Page;