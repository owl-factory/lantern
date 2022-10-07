
import { Box } from "@chakra-ui/react";
import React from "react";
import { useDisclosure } from "@chakra-ui/react";
import { FileDetailModal } from "./AssetDetailModal";

interface FileListProps {
  listFormat: any;
}

/**
 * Renders the library list containing a user's images.
 * @param listFormat The method by which the list is rendered.
 */
export function FileList(props: FileListProps): JSX.Element {
  const detailModal = useDisclosure();


  return (
    <Box>
      <FileDetailModal />
    </Box>
  );
}
