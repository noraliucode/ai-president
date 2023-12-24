import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

// Styled component for the red circle
const WhiteCircle = styled("div")({
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  backgroundColor: "white",
  marginRight: "8px",
});

// Styled component for the container with the blinking animation, red background, and fixed position
const BlinkingBox = styled(Box)(({ theme }) => ({
  height: "40px", // Set height to 40px
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
  width: "300px", // Set width to 300px
  backgroundColor: "red", // Set background color to red
  position: "fixed", // Make the box fixed at the top
  top: 0, // Stick to the top of the viewport
  left: "50%", // Horizontally center the box
  transform: "translateX(-50%)", // Adjust for exact centering
  zIndex: 1000, // Ensure it stays on top of other elements
  animation: "blink 3s infinite", // Set to blink every 3 seconds infinitely
  "@keyframes blink": {
    "0%": { opacity: 1 },
    "50%": { opacity: 0.5 },
    "100%": { opacity: 1 },
  },
}));

const BlinkingElement: React.FC = () => {
  return (
    <BlinkingBox>
      <WhiteCircle />
      <Typography
        variant="h6"
        sx={{
          color: "white", // Text color is white
          userSelect: "none",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        AI 生成中
      </Typography>
    </BlinkingBox>
  );
};

export default BlinkingElement;
