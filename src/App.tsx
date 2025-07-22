import React from "react";
import "./App.css";
import PoseSketch from "./model/Camera";
import PoseMatcher from "./model/Photo";
import Test from "./model/Both";

function App() {
  return (
    <div className="App">
      <PoseMatcher />
    </div>
  );
}

export default App;
