import React from "react";
import dynamic from "next/dynamic";
import { NextPageContext } from "next";
import { rest } from "utilities";
import { useRouter } from "next/router";

const Play = dynamic(
  () => import('../../components/reroll/play/Play'),
  { loading: () => <h1>...</h1>, ssr: false},
);

export default function PlayPage(): JSX.Element {
  const router = useRouter();
  const [props, setProps] = React.useState(undefined)
  
  console.log(props)
  
  return (
    <Play />
  );

  
}