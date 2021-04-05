import React from "react";
import dynamic from "next/dynamic";

const Play = dynamic(
  () => import('../../components/reroll/play/Play'),
  { loading: () => <h1>...</h1>, ssr: false},
);

export default function PlayPage(): JSX.Element {
  return (
    <Play />
  );
}
