import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  flyingImage: {
    width: 80,
    animation: "$flyAndFade 1s ease-out infinite",
  },
  "@keyframes flyAndFade": {
    "0%": {
      transform: "translateY(0)",
      opacity: 1,
    },
    "80%": {
      transform: "translateY(-500px)",
      opacity: 1,
    },
    "100%": {
      transform: "translateY(-600px)",
      opacity: 0,
    },
  },
});

interface PlusOneProps {
  src: string;
}

export default function PlusOne(props: PlusOneProps) {
  const classes = useStyles();
  const { src } = props;

  return <img src={src} className={classes.flyingImage} alt="Flying" />;
}
