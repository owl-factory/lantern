import dynamic from "next/dynamic";
import React from "react";

const EditorContent = dynamic(
  () => import('components/reroll/editor/EditorContent'),
  { loading: () => <></>, ssr: false},
);

export default function Editor(): JSX.Element {
  return <EditorContent/>;
}