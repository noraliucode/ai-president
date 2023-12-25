import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const Countdown = ({
  duration,
  shouldDelayPlayStart,
}: {
  duration: number;
  shouldDelayPlayStart: boolean;
}) => {
  const [counter, setCounter] = useState(Math.round(duration));

  useEffect(() => {
    // Round the duration to avoid displaying decimals
    setCounter(Math.round(duration));
  }, [duration]);

  useEffect(() => {
    let timerId: NodeJS.Timer | undefined;

    if (counter > 0 && shouldDelayPlayStart) {
      timerId = setInterval(
        () => setCounter((prevCounter) => prevCounter - 1),
        1000
      );
    } else {
      clearInterval(timerId);
    }

    // Cleanup function to clear the interval
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [counter, shouldDelayPlayStart]);

  // Convert the remaining time into minutes and seconds for display
  const minutes = Math.floor(counter / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (counter % 60).toString().padStart(2, "0");

  return (
    <Box
      sx={{
        position: "absolute",
        right: "33px",
        top: "80vh",
      }}
    >
      <Typography
        sx={{
          fontFamily: '"Digital-7 Mono", monospace',
          fontSize: "3rem",
          color: "red",
          border: "2px solid white",
          padding: "0 10px",
          backgroundColor: "black",
          userSelect: "none",
          borderRadius: "5px",
        }}
      >
        {`${minutes}:${seconds}`}
      </Typography>
    </Box>
  );
};

export default Countdown;
