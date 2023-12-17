import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const Countdown = () => {
  // To start with 10 minutes; convert 10 minutes to seconds
  const [counter, setCounter] = useState(10 * 60);

  useEffect(() => {
    let timerId: string | number | NodeJS.Timer | undefined;

    if (counter > 0) {
      timerId = setInterval(() => setCounter(counter - 1), 1000);
    }

    // Cleanup function to clear the interval
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [counter]);

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
        top: "70vh",
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
