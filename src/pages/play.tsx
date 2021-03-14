import React from "react";
import dynamic from "next/dynamic";

const Play = dynamic(
  () => import('../components/reroll/play/Play'),
  { loading: () => <h1>...</h1>, ssr: false},
);

const table = {
  _id: "1234",
  ownerID: "321",
};

const user = {
  _id: "0987",
};

export default function PlayPage(): JSX.Element {
  return (
    <Play table={table} user={user}/>
  );
}
