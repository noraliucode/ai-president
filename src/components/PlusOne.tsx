import React from "react";
import { makeStyles } from "@mui/styles";

interface PlusOneProps {
  src: string;
  position: "left" | "center" | "right";
}

const useStyles = makeStyles({
  imageWrapper: (props: PlusOneProps) => ({
    position: "fixed", // Fixed positioning
    top: "300px", // Start from the bottom
    left:
      props.position === "left"
        ? "300px"
        : props.position === "center"
        ? "55%"
        : "auto",
    right: props.position === "right" ? "150px" : "auto",
    transform: props.position === "center" ? "translateX(-50%)" : "none",
    margin: 0, // No margin
    padding: 0, // No padding
  }),
  flyingImage: {
    position: "absolute",
    width: 80,
    animation: "$flyAndFade 1s ease-out infinite",
  },
  "@keyframes flyAndFade": {
    "0%": {
      transform: "translateY(0)",
      opacity: 1,
    },
    "80%": {
      transform: "translateY(-30vh)",
      opacity: 0.8,
    },
    "100%": {
      transform: "translateY(-40vh)",
      opacity: 0,
    },
  },
});

export default function PlusOne(props: PlusOneProps) {
  const { src, position } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.imageWrapper}>
      <img src={src} className={classes.flyingImage} alt="Flying" />
    </div>
  );
}
