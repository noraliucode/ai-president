import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import PlusOneSnackbar from "./PlusOneSnackbar";

const API_URL = process.env.REACT_APP_API_URL;

interface PercentagesState {
  prevBlue: number | null;
  prevWhite: number | null;
  prevGreen: number | null;
  showBluePlusOne: boolean;
  showWhitePlusOne: boolean;
  showGreenPlusOne: boolean;
  blue: number;
  white: number;
  green: number;
}

const ProgressContainer = styled("div")({
  width: "95%",
  height: "20px",
  border: "solid 3px #C2C2C2",
  position: "absolute",
  top: "90vh",
  backgroundColor: "#E0E0E0",
  display: ["-webkit-box", "-webkit-flex", "-ms-flexbox", "flex"],
  overflow: "hidden",
  left: "50%",
  transform: "translateX(-50%)",
  borderRadius: "10px",
});

const ProgressBar = styled("div")<{ width: number; bgColor: string }>(
  ({ width, bgColor }) => ({
    height: "100%",
    width: `${width}%`,
    background: bgColor,
    transition: "width 0.5s ease-in-out",
  })
);

const VotingProgressBar: React.FC = () => {
  const [percentages, setPercentages] = useState<PercentagesState>({
    prevBlue: null,
    prevWhite: null,
    prevGreen: null,
    showBluePlusOne: false,
    showWhitePlusOne: false,
    showGreenPlusOne: false,
    blue: 33.3333,
    white: 33.3333,
    green: 33.3333,
  });

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await fetch(`${API_URL}/chat`); // Fetch from your server endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Calculate the total count
        const totalCount =
          data.blueCount + data.whiteCount + data.greenCount + 3; // Adding 3 for the initial 33% for each color
        // Calculate the percentages
        const bluePercentage = ((data.blueCount + 1) / totalCount) * 100; // Adding 1 for the initial 33%
        const whitePercentage = ((data.whiteCount + 1) / totalCount) * 100; // Adding 1 for the initial 33%
        const greenPercentage = ((data.greenCount + 1) / totalCount) * 100; // Adding 1 for the initial 33%

        // Check for percentage increase and update state accordingly
        setPercentages((prev) => ({
          ...prev,
          showBluePlusOne:
            prev.prevBlue !== null && bluePercentage > prev.prevBlue,
          showWhitePlusOne:
            prev.prevWhite !== null && whitePercentage > prev.prevWhite,
          showGreenPlusOne:
            prev.prevGreen !== null && greenPercentage > prev.prevGreen,
          prevBlue: bluePercentage,
          prevWhite: whitePercentage,
          prevGreen: greenPercentage,
          blue: bluePercentage,
          white: whitePercentage,
          green: greenPercentage,
        }));
      } catch (error) {
        console.error("Fetching error: ", error);
      }
    };

    const interval = setInterval(fetchChatData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = (color: string) => () => {
    setPercentages((prev) => ({
      ...prev,
      [`show${color}PlusOne`]: false,
    }));
  };

  return (
    <>
      <ProgressContainer>
        <ProgressBar width={percentages.blue} bgColor="#0044CC" />
        <ProgressBar width={percentages.white} bgColor="#FFFFFF" />
        <ProgressBar width={percentages.green} bgColor="#00CC44" />
      </ProgressContainer>

      <PlusOneSnackbar
        open={percentages.showBluePlusOne}
        handleClose={handleClose("Blue")}
        message="Blue +1"
      />
      <PlusOneSnackbar
        open={percentages.showWhitePlusOne}
        handleClose={handleClose("White")}
        message="White +1"
      />
      <PlusOneSnackbar
        open={percentages.showGreenPlusOne}
        handleClose={handleClose("Green")}
        message="Green +1"
      />
    </>
  );
};

export default VotingProgressBar;
