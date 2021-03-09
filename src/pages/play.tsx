import React from "react";
import dynamic from "next/dynamic";

const Play = dynamic(
  () => import('../components/reroll/play/Play'),
  { loading: () => <p>...</p>}
);


export default function PlayPage() {
  return (
    <>
      Hi,
      <Play/>
    </>
  );
}
