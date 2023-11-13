// Debate.tsx
import React from "react";
import MediaUI from "../components/MediaUI";

const mediaConfigs = [
  {
    audioUrl: "https://archive.org/download/11yiyi/11yiyi.mp3",
    idleVideo: "idle_a.mp4",
    elementId: "talk-video",
  },
];
const mediaConfigs2 = [
  {
    audioUrl: "https://archive.org/download/11yiyi/11yiyi.mp3",
    idleVideo: "idle_b.mp4",
    elementId: "talk-video-2",
  },
];

const MyComponent: React.FC = () => {
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
        <div className="card">
          <MediaUI mediaConfigs={mediaConfigs} />
        </div>
        <div className="card">
          <MediaUI mediaConfigs={mediaConfigs2} />
        </div>
        <div className="card"></div>
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

      {/* Custom Progress Bar */}
      <div className="custom-progress-container" style={{ width: "100%" }}>
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
      </div>
    </div>
  );
};

export default MyComponent;
