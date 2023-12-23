import React from "react";
import Box from "@mui/material/Box";
import ProgressBars from "./ProgressBars";
import { Grid } from "@mui/material";

const TopLeftBox: React.FC = () => {
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
