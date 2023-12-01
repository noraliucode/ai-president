// Debate.tsx
import React, { useEffect, useState } from "react";
import MediaUI from "../components/MediaUI";
import config from "./conversation.json";
import tesConfig from "./testConversation.json";

// const mediaConfigs = config.conversation;
const mediaConfigs = tesConfig.conversation;

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

    const timer = setTimeout(() => {
      updateMediaStateForRole(currentConfig.role, { shouldPlay: false });
      setCurrentConfigIndex((currentIndex) => currentIndex + 1);
    }, currentConfig.duration * 1000 + 1000); // 1000ms buffering

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

  // Adjust these percentages for your progress bar
  const bluePercentage = 50;
  const whitePercentage = 30;
  const greenPercentage = 20;

  return (
    <div
      style={{
        backgroundImage: 'url("/flag_bg.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        padding: "20px",
        height: "100vh",
      }}
    >
      {/* Marquee */}
      <div className="sticky-marquee">
        <div
          style={{
            overflow: "hidden",
            color: "white",
            padding: "5px",
            marginBottom: "20px",
          }}
        >
          <span className="marquee-content">
            以下內容純屬虛構，認真就輸了。以下內容純屬虛構，認真就輸了。以下內容純屬虛構，認真就輸了。以下內容純屬虛構，認真就輸了。以下內容純屬虛構，認真就輸了。以下內容純屬虛構，認真就輸了。
          </span>
        </div>
      </div>

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
          position: "absolute",
        }}
      >
        <button onClick={handleConnectAll}>Connect All MediaUIs</button>
        <button onClick={handleStartDebate}>Start Debate</button>
        <button onClick={handleDestroyAll}>Destroy All MediaUIs</button>
      </div>

      {/* Custom Progress Bar */}
      {/* <div className="custom-progress-container" style={{ width: "100%" }}>
        <div
          className="custom-progress-bar"
          style={{ width: `${bluePercentage}%`, background: "blue" }}
        ></div>
        <div
          className="custom-progress-bar"
          style={{ width: `${whitePercentage}%`, background: "white" }}
        ></div>
        <div
          className="custom-progress-bar"
          style={{ width: `${greenPercentage}%`, background: "green" }}
        ></div>
      </div> */}
    </div>
  );
};

export default Debate;
