import dynamic from "next/dynamic";
import React from "react";

const SceneBuilder = dynamic(
  () => import('components/reroll/scenes/pages/SceneBuilder'),
  { loading: () => <></>, ssr: false},
);

export default function SceneBuilderPage() {
  if (SceneBuilder) {
    return <SceneBuilder/>;
  } else {
    return <></>;
  }
}
