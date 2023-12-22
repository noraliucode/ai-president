import React, { useEffect, useState } from "react";
import { Box, Typography, LinearProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import PlusOne from "./PlusOne";

const API_URL = process.env.REACT_APP_API_URL;

interface ProgressBarProps {
  label: string;
  value: number;
  barColor: string;
}

interface PercentagesState {
  blue: number;
  white: number;
  green: number;
  showBluePlusOne: boolean;
  showWhitePlusOne: boolean;
  showGreenPlusOne: boolean;
}

// Styled LinearProgress component
const CustomProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "barColor",
})<{ barColor: string }>(({ barColor }) => ({
  height: 20,
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  "& .MuiLinearProgress-bar": {
    backgroundColor: barColor,
  },
}));

// ProgressBar component with label and percentage
const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  barColor,
}) => (
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
        left="5px"
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
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  </Box>
);

// ProgressBars component with dynamic data fetching
const ProgressBars = () => {
  const [percentages, setPercentages] = useState({
    blue: 33.3333,
    white: 33.3333,
    green: 33.3333,
    showBluePlusOne: false,
    showWhitePlusOne: false,
    showGreenPlusOne: false,
  });

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetch(`${API_URL}/chat`); // Fetch from your server endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Calculate the percentages
        const totalCount =
          data.blueCount + data.whiteCount + data.greenCount + 3;
        const bluePercentage = ((data.blueCount + 1) / totalCount) * 100;
        const whitePercentage = ((data.whiteCount + 1) / totalCount) * 100;
        const greenPercentage = ((data.greenCount + 1) / totalCount) * 100;

        setPercentages((prev) => ({
          blue: bluePercentage,
          white: whitePercentage,
          green: greenPercentage,
          showBluePlusOne: prev.blue < bluePercentage,
          showWhitePlusOne: prev.white < whitePercentage,
          showGreenPlusOne: prev.green < greenPercentage,
        }));
      } catch (error) {
        console.error("Fetching error: ", error);
      }
    };

    const interval = setInterval(fetchChatData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box>
        <ProgressBar
          label="侯侯 GPT"
          value={percentages.blue}
          barColor="#9093FF"
        />
        <ProgressBar
          label="柯柯 GPT"
          value={percentages.white}
          barColor="#F7F975"
        />
        <ProgressBar
          label="賴賴 GPT"
          value={percentages.green}
          barColor="#FF9DEF"
        />
        {percentages.showWhitePlusOne && (
          <PlusOne src="/images/plus_1/white_plus_1.png" position="left" />
        )}
        {percentages.showBluePlusOne && (
          <PlusOne src="/images/plus_1/blue_plus_1.png" position="right" />
        )}
        {percentages.showGreenPlusOne && (
          <PlusOne src="/images/plus_1/green_plus_1.png" position="center" />
        )}
      </Box>
    </>
  );
};

export default ProgressBars;
