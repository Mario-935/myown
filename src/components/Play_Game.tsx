import React from "react";
import PhotoGame from "../model/DetectPhoto";

const PlayGame = ({ gamemode, pic }: { gamemode: number; pic: string }) => {
  if (gamemode === 100) {
    return (
      <div className="grid content-center justify-center justify-items-center h-screen w-screen">
        <h1>Picture</h1>
        {pic ? <PhotoGame Photo={pic} /> : <p>No image selected</p>}
      </div>
    );
  }

  if (gamemode === 0) {
    return (
      <div className="grid content-center justify-center justify-items-center h-screen w-screen">
        <h1>Photo</h1>
      </div>
    );
  }

  return null;
};

export default PlayGame;
