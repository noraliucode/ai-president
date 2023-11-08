// File: MediaUI.jsx
import React, { useEffect, useRef, useState } from "react";
import MediaHandler from "./MediaHandler";

// Define the MediaConfig type
interface MediaConfig {
  audioUrl: string;
  videoUrl: string;
}

// Define the prop type for MediaUI
interface MediaUIProps {
  mediaConfigs: MediaConfig[];
}

const MediaUI: React.FC<MediaUIProps> = ({ mediaConfigs }) => {
  // Assume the first config is the active config initially
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  const mediaHandlerRef = useRef(
    new MediaHandler(mediaConfigs[activeConfigIndex])
  );

  const onConnect = () => {
    mediaHandlerRef.current.connect();
  };

  const onPlayVideo = () => {
    mediaHandlerRef.current.playVideo();
  };

  const onDestroy = () => {
    mediaHandlerRef.current.destroy();
  };

  return (
    <div>
      <video id="talk-video" playsInline />
      <button id="connect-button" onClick={onConnect}>
        Connect
      </button>
      <button id="play-video-button" onClick={onPlayVideo}>
        Play Video
      </button>
      <button id="destroy-button" onClick={onDestroy}>
        Destroy
      </button>
    </div>
  );
};

export default MediaUI;
