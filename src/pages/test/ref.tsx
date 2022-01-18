import { Button } from "@owl-factory/components/button";
import { Input, RadioButton, Select } from "@owl-factory/components/form";
import { Page } from "components/design";
import { Form, Formik } from "formik";
import React from "react";
import { collections, decode, encode } from "utilities/ref";

export default function RefTest() {
  const [ result, setResult ] = React.useState("");

  const options: JSX.Element[] = [<option value=""></option>];
  collections.forEach((collection: any) => {
    options.push(<option value={collection.string}>{collection.string}</option>);
  });

  function onSubmit(values: any) {
    switch(values.encodeOrDecode) {
      case "encode":
        const encodedRef = encode(values.value, values.collection) || "";
        setResult(encodedRef);
        break;
      case "decode":
        const decodedRef = decode(values.value);
        if (!decodedRef) {
          setResult("Invalid Ref");
          return;
        }

        setResult(`ID: ${decodedRef.id}. Collection: ${decodedRef.collection}`);
        break;
      default:
        setResult("");
        break;
    }
  }

  return (
    <Page>
      <Formik
        initialValues={{
          value: "",
          collection: "",
          encodeOrDecode: "decode",
        }}
        onSubmit={onSubmit}
      >
        <Form>
          Value
          <Input type="text" name="value"/>
          Collection
          <Select name="collection">
            {options}
          </Select>
          <RadioButton name="encodeOrDecode" label="Decode" value="decode"/>
          <RadioButton name="encodeOrDecode" label="Encode" value="encode"/>
          Result: {result}<br/>
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </Page>
  )
}
