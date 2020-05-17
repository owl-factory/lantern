import {
  Backdrop as MuiBackdrop,
  Container,
  createStyles,
  Fade as MuiFade,
  makeStyles,
  Modal as MuiModal,
  Theme,
} from "@material-ui/core";
import React from "react";

// TODO - add flag for "You may have unsaved changes!" before closing

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

interface IModal {
  children?: JSX.Element; // The children to place within the modal
  ariaLabeledBy?: string; // Accessibility label
  ariaDescribedBy?: string; // Accessibility description
  dirty?: boolean; // True if this modal has been touched
}

/**
 * Registers a new modal and an open function linked together, allowing for
 * multiple modals to be created and used without interfering with each other.
 */
function registerModal(): [(props: any) => (JSX.Element | null), () => (void)] {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  /**
   * Opens the modal
   */
  function handleOpen() {
    setOpen(true);
  }

  /**
   * Closes the modal
   */
  function handleClose(isDirty?: boolean) {
    if (isDirty === true) {
      if (!confirm("Are you sure you want to close? You might lose data?")) {
        return;
      }
    }
    setOpen(false);
  }

  /**
   * Renders a modal with the given settings and passed props
   * @param props see IModal
   */
  function Modal(props: IModal): JSX.Element | null {
    return (
        <MuiModal
          aria-describedby={props.ariaDescribedBy}
          className={classes.modal}
          open={open}
          onClose={() => handleClose(props.dirty)}
          closeAfterTransition
          BackdropComponent={MuiBackdrop}
          BackdropProps={{timeout: 500}}
        >
          <MuiFade in={open}>
            <Container fixed className={classes.paper}>
              {props.children}
            </Container>
          </MuiFade>
        </MuiModal>
    );
  }

  return [Modal, handleOpen];
}

export default registerModal;
