import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ProgressBars from "./ProgressBars";
import { Grid } from "@mui/material";

const TopLeftBox: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Timeout to show the component after 33 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 33000);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array to run only once after the initial render

  // Render the component only if isVisible is true
  if (!isVisible) {
    return null;
  }

  return (
    <div>
      <Grid
        container
        spacing={2}
        justifyContent="space-evenly"
        alignItems="flex-start"
      >
        <Grid item xs={4}>
          <></>
        </Grid>
        <Grid
          item
          xs={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <></>
        </Grid>
        <Grid item xs={4}>
          {/* Third element goes here */}
          {<ProgressBars />}
        </Grid>
      </Grid>
    </div>
  );
};

export default TopLeftBox;
