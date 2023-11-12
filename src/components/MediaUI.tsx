// File: MediaUI.jsx
import React, { useEffect, useRef, useState } from "react";
import MediaHandler from "./MediaHandler";

// Define the MediaConfig type
interface MediaConfig {
  audioUrl: string;
  idleVideo: string;
  elementId: string;
}

// Define the prop type for MediaUI
interface MediaUIProps {
  mediaConfigs: MediaConfig[];
}

const MediaUI: React.FC<MediaUIProps> = ({ mediaConfigs }) => {
  // Assume the first config is the active config initially
  const [activeConfigIndex, setActiveConfigIndex] = useState(0);
  let mediaHandlerRef = useRef<MediaHandler | null>(null);
  const elementId = mediaConfigs[activeConfigIndex].elementId;

  useEffect(() => {
    if (
      document.getElementById(elementId) &&
      document.getElementById("ice-gathering-status-label")
    ) {
      mediaHandlerRef.current = new MediaHandler(
        mediaConfigs[activeConfigIndex]
      );
    }
  }, [mediaConfigs, activeConfigIndex]);

  const onConnect = () => {
    mediaHandlerRef?.current?.connect();
  };

  const onPlayVideo = () => {
    mediaHandlerRef?.current?.playVideo();
  };

  const onDestroy = () => {
    mediaHandlerRef?.current?.destroy();
  };

  return (
    <div>
      <video id={elementId} playsInline width="400" height="400" autoPlay />
      <button id="connect-button" onClick={onConnect}>
        Connect
      </button>
      <button id="play-video-button" onClick={onPlayVideo}>
        Play Video
      </button>
      <button id="destroy-button" onClick={onDestroy}>
        Destroy
      </button>

      <div id="status">
        ICE gathering status: <label id="ice-gathering-status-label"></label>
        <br />
        ICE status: <label id="ice-status-label"></label>
        <br />
        Peer connection status: <label id="peer-status-label"></label>
        <br />
        Signaling status: <label id="signaling-status-label"></label>
        <br />
        Streaming status: <label id="streaming-status-label"></label>
        <br />
      </div>
    </div>
  );
};

export default MediaUI;
