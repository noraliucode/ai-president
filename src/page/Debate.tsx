// Debate.tsx
import React, { useEffect, useState } from "react";
import MediaUI from "../components/MediaUI";
import config from "./conversation.json";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import ProgressBar from "../components/ProgressBars";
import Countdown from "../components/Countdown";
import Footer from "../components/Footer";
import BlinkingElement from "../components/BlinkingElement";
import PhraseTitle from "../components/PhraseTitle";

const mediaConfigs = config.conversation;

interface MediaConfig {
  role: string;
  url: string;
  duration: number;
}

const Debate: React.FC = () => {
  const [currentConfigIndex, setCurrentConfigIndex] = useState(-1);
  const [showVoting, setVoting] = useState(true);
  const [currentConfig, setCurrentConfig] = useState<MediaConfig | null>(null);
  const [mediaStates, setMediaStates] = useState({
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
    ho: {
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
      setCurrentConfig(null);
      return;
    }

    const config = mediaConfigs[currentConfigIndex];
    setCurrentConfig(config);

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

  const toggleVoting = () => {
    setVoting(!showVoting);
  };

  return (
    <div
      style={{
        backgroundImage: 'url("/images/bg3.png")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh",
        padding: "40px 60px 0 60px",
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent="space-evenly"
        alignItems="flex-start"
      >
        <Grid item xs={4}>
          <img
            src="/images/logo.png"
            alt="logo"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: "355px",
            }}
          />
        </Grid>
        <Grid
          item
          xs={4}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BlinkingElement />
          {/* <PhraseTitle text={"text"} /> */}
        </Grid>
        <Grid item xs={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              backgroundImage: "url(/images/title_bg.png)",
              backgroundSize: "cover",
              width: "300px",
              height: "100px",
            }}
          >
            <Typography
              sx={{
                fontSize: "25px",
                color: "black",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              辯題
            </Typography>
            <>
              <Typography
                sx={{
                  fontSize: "2rem",
                  color: "white",
                  padding: "8px",
                  userSelect: "none",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {config.title}
              </Typography>
            </>
          </div>
        </Grid>
      </Grid>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          marginTop: "60px",
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
                label={role}
              />
            </div>
          )
        )}
        <Countdown
          duration={
            currentConfigIndex > -1 && currentConfigIndex < mediaConfigs.length
              ? mediaConfigs[currentConfigIndex].duration
              : 0
          }
        />
        <Footer />
      </div>

      <div
        style={{
          marginTop: "100vh",
        }}
      >
        <button onClick={handleConnectAll}>Connect All MediaUIs</button>
        <button onClick={handleStartDebate}>Start Debate</button>
        <button onClick={handleDestroyAll}>Destroy All MediaUIs</button>
        <button onClick={toggleVoting}>Toggle voting bar</button>
      </div>
    </div>
  );
};

export default Debate;
