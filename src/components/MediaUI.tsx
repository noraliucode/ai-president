// File: MediaUI.jsx
import React, { useEffect, useRef } from "react";
import MediaHandler from "./MediaHandler";

// Define the MediaConfig type
interface MediaConfig {
  url: string;
  role: string;
  idleVideos: string[];
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
  const initializedRolesRef = useRef<Set<string>>(new Set());
  const elementId = mediaConfig.role;

  useEffect(() => {
    const role = mediaConfig.role;

    // Check if the MediaHandler instance for this role has already been created
    if (!initializedRolesRef.current.has(role)) {
      // Create a new MediaHandler instance if it hasn't been created for this role
      mediaHandlerRef.current = new MediaHandler(mediaConfig);
      initializedRolesRef.current.add(role);
    } else {
      // Update only the audioUrl of the existing MediaHandler instance
      mediaHandlerRef.current?.updateAudioUrl(mediaConfig.url);
    }
  }, [mediaConfig]);

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

  const onVideoEnded = () => {
    if (!mediaHandlerRef.current?.videoIsPlaying) {
      mediaHandlerRef.current?.playIdleVideo();
    }
  };

  return (
    <div>
      <video id={elementId} onEnded={onVideoEnded} playsInline width="400" height="400" autoPlay />

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
