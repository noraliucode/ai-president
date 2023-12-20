import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Debate from "./page/Debate";
import ProgressBar from "./components/ProgressBar";
import Countdown from "./components/Countdown";

function App() {
  return (
    <>
      <Debate />
      {/* <ProgressBar /> */}
      <Countdown />
    </>
  );
}

export default App;
