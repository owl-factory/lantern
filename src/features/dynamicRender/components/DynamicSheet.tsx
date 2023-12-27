// import { useContext } from "react";
// import { DynamicContext } from "../context/dynamicContext";
import { TextInput } from "./form/TextInput";

/**
 * Renders the Sheet portion of a DynamicRender
 */
export function DynamicSheet() {
  // const { ready } = useContext(DynamicContext);

  // if (!ready) {
  //   return <>Not ready</>;
  // }
  return (
    <>
      <TextInput />
      <TextInput />
    </>
  );
}
