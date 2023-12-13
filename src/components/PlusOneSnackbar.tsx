import React from "react";
import Snackbar, { SnackbarProps } from "@mui/material/Snackbar";
import Slide, { SlideProps } from "@mui/material/Slide";

interface PlusOneSnackbarProps {
  open: boolean;
  handleClose: SnackbarProps["onClose"]; // Using the type from SnackbarProps
  message?: string;
}

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const PlusOneSnackbar: React.FC<PlusOneSnackbarProps> = ({
  open,
  handleClose,
  message,
}) => {
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      message={message}
      key={SlideTransition.name}
      autoHideDuration={2000} // The notification will hide after 2 seconds
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    />
  );
};

export default PlusOneSnackbar;
