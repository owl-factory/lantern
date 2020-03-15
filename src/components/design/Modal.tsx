import { Backdrop as MuiBackdrop, Button, createStyles, Fade as MuiFade, makeStyles, Modal as MuiModal, Theme } from "@material-ui/core";
import react from "react";

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
}

/**
 * Registers a new modal and an open function linked together, allowing for
 * multiple modals to be created and used without interfering with each other.
 */
function registerModal(): [(props: any) => (JSX.Element | null), () => (void)] {
  const [open, setOpen] = react.useState(false);
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
  function handleClose() {
    setOpen(false);
  }

  /**
   * Renders a modal with the given settings and passed props
   * @param props see IModal
   */
  function Modal(props: IModal): JSX.Element | null {
    return (
      <MuiModal
        aria-labeledby={props.ariaLabeledBy}
        aria-describedby={props.ariaDescribedBy}
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={MuiBackdrop}
        BackdropProps={{timeout: 500}}
      >
        <MuiFade in={open}>
          <div className={classes.paper}>
            {props.children}
          </div>
        </MuiFade>
      </MuiModal>
    );
  }

  return [Modal, handleOpen];
}

export default registerModal;
