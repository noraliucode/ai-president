import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";

const videos = [
  "/video1.mp4",
  "/video2.mp4",
  "/video3.mp4",
  "/video4.mp4",
  "/video5.mp4",
  "/video6.mp4",
];

const FullScreenVideo = styled("video")({
  position: "fixed",
  width: "100%",
  left: "50%",
  top: "50%",
  height: "100%",
  objectFit: "cover",
  transform: "translate(-50%, -50%)",
  zIndex: "3000",
});

const App = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const [key, setKey] = useState(0); // Unique key for the video component

  useEffect(() => {
    selectRandomVideo();
  }, []);

  const selectRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    console.log(
      `Selecting video at index ${randomIndex}: ${videos[randomIndex]}`
    );
    setVideoSrc(videos[randomIndex]);
    setKey((prevKey) => prevKey + 1); // Update key to force re-render
  };

  return (
    <div className="App">
      {videoSrc && (
        <FullScreenVideo
          autoPlay
          loop={false}
          onEnded={selectRandomVideo}
          key={key} // Unique key to force re-render
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </FullScreenVideo>
      )}
    </div>
  );
};

export default App;
