import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Debate from "./page/Debate";
import FullScreenVideoAll from "./components/FullScreenVideo";
import TopLeftBox from "./components/TopLeftBox";

function App() {
  return (
    <>
      {/* <Debate /> */}
      <TopLeftBox />
      <FullScreenVideoAll />
    </>
  );
}

export default App;
