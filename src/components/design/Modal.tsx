import { Backdrop as MuiBackdrop, Button, createStyles, Fade as MuiFade, makeStyles, Modal as MuiModal, Theme } from "@material-ui/core";
import react from "react";
import { def } from "../../helpers/common";

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
  children?: JSX.Element;
  linkText?: string;
  ariaLabeledBy?: string;
  ariaDescribedBy?: string;
  openComponent: JSX.Element;
}

function Modal(props: IModal) {
  const classes = useStyles();
  const [open, setOpen] = react.useState(false);
  const linkText = def<string>(props.linkText, "Modal Open");

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div>
      <div onClick={handleOpen}>
        {props.openComponent}
      </div>
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
    </div>
  );
}

export default Modal;
