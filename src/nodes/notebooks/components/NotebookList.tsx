import { gql, useQuery } from "@apollo/client";
import { Button, Select } from "@chakra-ui/react";
import { Notebook } from "@prisma/client";
import React from "react";

interface NotebookListProps {
  onSelect: (notebookID: string) => void;
}

const GET_NOTEBOOKS = gql`
  query {
    notebooks {
      id, name
    }
  }
`;

export function NotebookList(props: NotebookListProps) {
  const { data, loading, error, refetch } = useQuery<{ notebooks: Notebook[] }>(GET_NOTEBOOKS);

  function onChange(ev: React.ChangeEvent<HTMLSelectElement>) {
    props.onSelect(ev.target.value);
  }

  return (
    <>
      <Select onChange={onChange}>
        { !loading && data &&
          data.notebooks.map((notebook: Notebook) => (
            <option key={notebook.id} value={notebook.id}>{notebook.name}</option>
          ))
        }
      </Select>
      <Button onClick={refetch}>Refresh</Button>
    </>
  );
}
