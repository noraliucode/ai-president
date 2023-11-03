// File: MediaUI.jsx
import React, { useEffect, useRef, useState } from "react";
import MediaHandler from "./MediaHandler";

// Define the MediaConfig type
interface MediaConfig {
  audioUrl: string;
  videoUrl: string;
  triggerTime: number; // Trigger time in milliseconds
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

  // Function to switch to the next config
  const switchConfig = () => {
    const nextIndex = (activeConfigIndex + 1) % mediaConfigs.length;
    setActiveConfigIndex(nextIndex);
    mediaHandlerRef.current = new MediaHandler(mediaConfigs[nextIndex]); // Update the MediaHandler with the new config
  };

  useEffect(() => {
    const activeConfig = mediaConfigs[activeConfigIndex];
    const timerId = setTimeout(switchConfig, activeConfig.triggerTime);

    return () => {
      clearTimeout(timerId); // Clear the timer when the component unmounts or the active config changes
    };
  }, [activeConfigIndex, mediaConfigs]);

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
