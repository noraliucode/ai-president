// Debate.tsx
import React, { useEffect, useState } from "react";
import MediaUI from "../components/MediaUI";
import config from "./conversation.json";

const mediaConfigs = config.conversation;

const Debate: React.FC = () => {
  const [currentConfigIndex, setCurrentConfigIndex] = useState(-1);
  const [mediaStates, setMediaStates] = useState({
    ho: {
      url: null,
      shouldPlay: false,
      shouldConnect: false,
      shouldDestroy: false,
    },
    kp: {
      url: null,
      shouldPlay: false,
      shouldConnect: false,
      shouldDestroy: false,
    },
    lai: {
      url: null,
      shouldPlay: false,
      shouldConnect: false,
      shouldDestroy: false,
    },
  });

  console.log("mediaStates >>", mediaStates);

  // Function to update the URL and play state for a specific role
  const updateMediaStateForRole = (role: string, changes: any) => {
    setMediaStates((prev) => ({
      ...prev,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      [role]: { ...prev[role], ...changes },
    }));
  };

  useEffect(() => {
    if (currentConfigIndex < 0 || currentConfigIndex >= mediaConfigs.length) {
      return;
    }

    const currentConfig = mediaConfigs[currentConfigIndex];
    updateMediaStateForRole(currentConfig.role, {
      url: currentConfig.url,
      shouldPlay: true,
    });

    const nextConfig = mediaConfigs[currentConfigIndex + 1];
    const buffering = nextConfig?.role === currentConfig.role ? 0 : 1000;

    const timer = setTimeout(() => {
      updateMediaStateForRole(currentConfig.role, { shouldPlay: false });
      setCurrentConfigIndex((currentIndex) => currentIndex + 1);
    }, currentConfig.duration * 1000 + buffering); // 1000ms buffering

    return () => clearTimeout(timer);
  }, [currentConfigIndex]);

  const handleConnectAll = () => {
    Object.keys(mediaStates).forEach((role) =>
      updateMediaStateForRole(role, { shouldConnect: true })
    );
    // Optionally reset the state
    setTimeout(() => {
      Object.keys(mediaStates).forEach((role) =>
        updateMediaStateForRole(role, { shouldConnect: false })
      );
    }, 1000);
  };

  const handleDestroyAll = () => {
    Object.keys(mediaStates).forEach((role) =>
      updateMediaStateForRole(role, { shouldDestroy: true })
    );
    // Optionally reset the state
    setTimeout(() => {
      Object.keys(mediaStates).forEach((role) =>
        updateMediaStateForRole(role, { shouldDestroy: false })
      );
    }, 1000);
  };

  const handleStartDebate = () => {
    // Step 2: Add the function
    setCurrentConfigIndex(0);
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/images/bg.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: "20px",
        height: "100vh",
      }}
    >
      <h2
        style={{
          color: "black",
          marginBottom: "20px",
          WebkitTextStroke: "1px #FFB866",
        }}
      >
        2024 AI 總統辯論
      </h2>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        {Object.entries(mediaStates).map(
          ([role, { url, shouldPlay, shouldConnect, shouldDestroy }]) => (
            <div key={role} className="card">
              <MediaUI
                mediaConfig={{
                  role,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  url,
                  idleVideo: `/idle_${role}.mp4`, // Assuming a naming convention for idle videos
                }}
                shouldPlayVideo={shouldPlay}
                shouldConnect={shouldConnect}
                shouldDestroy={shouldDestroy}
              />
            </div>
          )
        )}
      </div>

      {/* Title */}
      <h2
        style={{
          color: "white",
          textAlign: "center",
          marginBottom: "20px",
          marginTop: "200px",
        }}
      >
        第一階段 申論
      </h2>
      <div
        style={{
          marginTop: "100vh",
        }}
      >
        <button onClick={handleConnectAll}>Connect All MediaUIs</button>
        <button onClick={handleStartDebate}>Start Debate</button>
        <button onClick={handleDestroyAll}>Destroy All MediaUIs</button>
      </div>
    </div>
  );
};

export default Debate;
