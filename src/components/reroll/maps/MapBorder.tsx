import dynamic from "next/dynamic";
import React from "react";

const MapContent = dynamic(
  () => import('./MapContent'),
  { loading: () => <></>, ssr: false},
);

export function MapBoard(): JSX.Element {
  return <MapContent/>;
}
