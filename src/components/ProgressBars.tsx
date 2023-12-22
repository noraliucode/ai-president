import React from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

// Define the interface for the progress bar properties
interface CustomProgressBarProps {
  barColor: string;
  value: number;
}

// Create a styled LinearProgress component
const CustomProgressBar = styled(LinearProgress)<CustomProgressBarProps>(
  ({ barColor }) => ({
    height: 20,
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Set a background color for the unfilled part
    "& .MuiLinearProgress-bar": {
      backgroundColor: barColor,
    },
  })
);

// Define the interface for the label and value properties
interface ProgressBarProps {
  label: string;
  value: number;
  barColor: string;
}

// The ProgressBar component with label and percentage
const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  barColor,
}) => {
  return (
    <Box width="100%" display="flex" alignItems="center" my={1}>
      <Box minWidth={120}>
        <Typography variant="body2" style={{ color: "white" }}>
          {label}
        </Typography>
      </Box>
      <Box width="100%" mr={1} position="relative">
        <CustomProgressBar
          variant="determinate"
          value={value}
          barColor={barColor}
        />
        <Box
          position="absolute"
          top={0}
          left="5px" // Position the percentage at the beginning of the bar
          bottom={0}
          display="flex"
          alignItems="center"
          style={{ pointerEvents: "none" }}
        >
          <Typography
            variant="body2"
            style={{
              color: "white",
              textShadow: "1px 1px 3px #000",
              WebkitTextStroke: "0.5px #000B6A",
              fontWeight: "bold",
            }}
          >{`${Math.round(value)}%`}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

// The main component that renders three progress bars
const ProgressBars: React.FC = () => {
  return (
    <Box>
      <ProgressBar label="科科 GPT" value={28} barColor="#F7F975" />
      <ProgressBar label="賴賴 GPT" value={54} barColor="#9093FF" />
      <ProgressBar label="侯侯 GPT" value={18} barColor="#FF9DEF" />
    </Box>
  );
};

export default ProgressBars;
