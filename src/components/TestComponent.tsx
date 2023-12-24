/**
 * A simple test component
 * @param name - The name of the input
 */
function TestComponent(props: { name?: string }) {
  return <input name={props.name} className="bg-green-300 m-2" />;
}

export default TestComponent;
