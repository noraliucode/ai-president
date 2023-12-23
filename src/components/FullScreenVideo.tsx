import React from "react";
// import myVideo from '/ai-president-01.mp4'; // Replace with your video file path
import { styled } from "@mui/material/styles";

const FullScreenVideo = styled("video")({
  position: "fixed",
  width: "100%",
  left: "50%",
  top: "50%",
  height: "100%",
  objectFit: "cover",
  transform: "translate(-50%, -50%)",
  zIndex: "-1",
});

const App: React.FC = () => {
  return (
    <div className="App">
      <FullScreenVideo autoPlay loop>
        <source src={"/ai-president-01.mp4"} type="video/mp4" />
        Your browser does not support the video tag.
      </FullScreenVideo>
      {/* Your other content goes here */}
    </div>
  );
};

export default App;
