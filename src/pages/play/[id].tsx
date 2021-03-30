import React from "react";
import dynamic from "next/dynamic";
import { NextPageContext } from "next";
import { rest } from "utilities";

const Play = dynamic(
  () => import('../../components/reroll/play/Play'),
  { loading: () => <h1>...</h1>, ssr: false},
);

const table = {
  _id: "laura-test",
  ownerID: "321",
};

const user = {
  _id: "0987",
};

export default function PlayPage(props: any): JSX.Element {
  

  return (
    <Play table={table} user={user}/>
  );
}

PlayPage.getInitialProp = async (ctx: NextPageContext) => {
  const res = await rest.get(`/api/play/${ctx.query.id}`);
  return res;
}