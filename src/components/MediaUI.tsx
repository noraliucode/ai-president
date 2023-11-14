// File: MediaUI.jsx
import React, { useEffect, useRef } from "react";
import MediaHandler from "./MediaHandler";

// Define the MediaConfig type
interface MediaConfig {
  url: string;
  role: string;
  idleVideo: string;
}

// Define the prop type for MediaUI
interface MediaUIProps {
  mediaConfig: MediaConfig;
  shouldConnect: boolean;
  shouldPlayVideo: boolean;
  shouldDestroy: boolean;
}

const MediaUI: React.FC<MediaUIProps> = ({
  mediaConfig,
  shouldConnect,
  shouldPlayVideo,
  shouldDestroy,
}) => {
  // Assume the first config is the active config initially
  const mediaHandlerRef = useRef<MediaHandler | null>(null);
  const elementId = mediaConfig.role;

  useEffect(() => {
    if (mediaHandlerRef.current) {
      // Update only the audioUrl of the existing MediaHandler instance
      mediaHandlerRef.current.updateAudioUrl(mediaConfig.url);
    } else {
      // Create a new MediaHandler instance if it doesn't exist
      mediaHandlerRef.current = new MediaHandler(mediaConfig);
    }
  }, [mediaHandlerRef]);

  useEffect(() => {
    if (shouldConnect && mediaHandlerRef.current) {
      mediaHandlerRef.current.connect();
    }
  }, [shouldConnect]);

  useEffect(() => {
    if (shouldPlayVideo && mediaHandlerRef.current) {
      mediaHandlerRef.current.playVideo();
    }
  }, [shouldPlayVideo]);

  useEffect(() => {
    if (shouldDestroy && mediaHandlerRef.current) {
      mediaHandlerRef.current.destroy();
      mediaHandlerRef.current = null;
    }
  }, [shouldDestroy]);

  return (
    <div>
      <video id={elementId} playsInline width="400" height="400" autoPlay />

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
