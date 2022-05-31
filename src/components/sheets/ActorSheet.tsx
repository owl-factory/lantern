import dynamic from "next/dynamic";
import React from "react";

const Sheet = dynamic(
  () => import('./Sheet'),
  { loading: () => <></>, ssr: false},
);

export function ActorSheet(props: any) {
  return <Sheet xml={props.xml}/>;
}
