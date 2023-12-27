import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Debate from "./page/Debate";
import FullScreenVideo from "./components/FullScreenVideo";

function App() {
  return (
    <>
      <FullScreenVideo />
      <Debate />
    </>
  );
}

export default App;
